using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;
using System.Linq;

namespace Application.Services;

public class PatientService : IPatientService
{
    private readonly IPatientRepository _patientRepository;
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _hasher;
    private readonly IEmailService _emailService;
    private readonly IJwtService _jwtService;

    public PatientService(
        IPatientRepository patientRepository,
        IUserRepository userRepository,
        IPasswordHasher hasher,
        IEmailService emailService,
        IJwtService jwtService)
    {
        _patientRepository = patientRepository;
        _userRepository = userRepository;
        _hasher = hasher;
        _emailService = emailService;
        _jwtService = jwtService;
    }

    public PatientDto RegisterPatient(RegisterPatientRequest request)
    {
        if (_userRepository.GetByEmail(request.Email) != null)
            throw new AppValidationException("EMAIL_ALREADY_EXISTS");

        if (_patientRepository.GetByDni(request.Dni) != null)
            throw new AppValidationException("DNI_ALREADY_EXISTS");

        var patient = new Patient(request.FirstName, request.LastName, request.Email, request.Dni);
        patient.SetPassword(_hasher.HashPassword(request.Password));

        _patientRepository.Add(patient);

        var saved = _patientRepository.GetById(patient.Id);

        return PatientDto.Create(saved!);
    }

    public PatientDto CreatePatientByDentist(CreatePatientByDentistRequest request)
    {
        if (_userRepository.GetByEmail(request.Email) != null)
            throw new AppValidationException("EMAIL_ALREADY_EXISTS");

        if (_patientRepository.GetByDni(request.Dni) != null)
            throw new AppValidationException("DNI_ALREADY_EXISTS");

        var patient = new Patient(request.FirstName, request.LastName, request.Email, request.Dni)
        {
            Address = request.Address,
            PhoneNumber = request.PhoneNumber,
            City = request.City,
            MembershipNumber = request.MembershipNumber,
            BirthDate = request.BirthDate,
            HealthPlanId = request.HealthPlanId
        };

        var tempPassword = GenerateTemporaryPassword();
        patient.SetPassword(_hasher.HashPassword(tempPassword));

        _patientRepository.Add(patient);

        var saved = _patientRepository.GetById(patient.Id);

        var activationToken = _jwtService.GenerateActivationTokenForPatient(patient.Id);
        _emailService.SendActivationEmailAsync(patient.Email, activationToken);

        return PatientDto.Create(saved!);
    }

    private string GenerateTemporaryPassword()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var random = new Random();
        return "Tmp-" + new string(Enumerable.Repeat(chars, 10).Select(s => s[random.Next(s.Length)]).ToArray());
    }

    public void ActivatePatient(string token, string password)
    {
        var principal = _jwtService.ValidateToken(token);
        var patientIdClaim = principal.FindFirst("patientId"); 
        if (patientIdClaim == null)
            throw new AppValidationException("INVALID_TOKEN");

        int patientId = int.Parse(patientIdClaim.Value);
        var patient = _patientRepository.GetById(patientId)
            ?? throw new NotFoundException("PATIENT_NOT_FOUND");

        patient.SetPassword(_hasher.HashPassword(password));
        _patientRepository.Update(patient);
    }

    public IEnumerable<PatientDto> GetAllPatients()
    {
        var patients = _patientRepository.List();
        if (patients == null || !patients.Any())
            throw new NotFoundException("NO_PATIENTS_FOUND");

        return patients.Select(PatientDto.Create);
    }

    public PatientDto GetPatientById(int id)
    {
        var patient = _patientRepository.GetById(id)
            ?? throw new NotFoundException("PATIENT_NOT_FOUND");
        return PatientDto.Create(patient);
    }

    public PatientDto UpdatePatient(int id, UpdatePatientRequest request)
    {
        var patient = _patientRepository.GetById(id)
            ?? throw new NotFoundException("PATIENT_NOT_FOUND");

        if (!string.IsNullOrEmpty(request.Email) &&
            _userRepository.GetByEmail(request.Email) != null &&
            request.Email != patient.Email)
            throw new AppValidationException("EMAIL_ALREADY_EXISTS");

        if (!string.IsNullOrEmpty(request.FirstName)) patient.FirstName = request.FirstName;
        if (!string.IsNullOrEmpty(request.LastName)) patient.LastName = request.LastName;
        if (!string.IsNullOrEmpty(request.Email)) patient.Email = request.Email;
        if (!string.IsNullOrEmpty(request.Address)) patient.Address = request.Address;
        if (!string.IsNullOrEmpty(request.PhoneNumber)) patient.PhoneNumber = request.PhoneNumber;
        if (!string.IsNullOrEmpty(request.City)) patient.City = request.City;
        if (!string.IsNullOrEmpty(request.MembershipNumber)) patient.MembershipNumber = request.MembershipNumber;
        if (request.BirthDate.HasValue) patient.BirthDate = request.BirthDate;
        if (request.HealthPlanId.HasValue) patient.HealthPlanId = request.HealthPlanId.Value;

        _patientRepository.Update(patient);

        var saved = _patientRepository.GetById(patient.Id);

        return PatientDto.Create(saved!);
    }

    public PatientDto UpdatePatientEmail(int id, UpdatePatientEmailRequest request)
    {
        var patient = _patientRepository.GetById(id)
            ?? throw new NotFoundException("PATIENT_NOT_FOUND");

        if (_userRepository.GetByEmail(request.Email) != null && request.Email != patient.Email)
            throw new AppValidationException("EMAIL_ALREADY_EXISTS");

        patient.Email = request.Email;
        _patientRepository.Update(patient);

        var saved = _patientRepository.GetById(patient.Id);

        return PatientDto.Create(saved!);
    }

    public void UpdatePatientPassword(int id, UpdatePatientPasswordRequest request)
    {
        var patient = _patientRepository.GetById(id)
            ?? throw new NotFoundException("PATIENT_NOT_FOUND");

        if (!_hasher.VerifyPassword(request.CurrentPassword, patient.Password!))
            throw new AppValidationException("CURRENT_PASSWORD_INCORRECT");

        patient.SetPassword(_hasher.HashPassword(request.NewPassword));
        _patientRepository.Update(patient);
    }
}


