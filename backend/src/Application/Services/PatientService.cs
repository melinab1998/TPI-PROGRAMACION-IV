using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;


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

    // Obtiene todos los pacientes registrados en el sistema.
    public List<PatientDto> GetAllPatients()
    {
        var patients = _patientRepository.List();
        if (!patients.Any())
            return new List<PatientDto>();

        return PatientDto.CreateList(patients);
    }

    // Obtiene un paciente por su identificador único.
    public PatientDto GetPatientById(int id)
    {
        var patient = _patientRepository.GetById(id)
            ?? throw new NotFoundException("PATIENT_NOT_FOUND");
        return PatientDto.Create(patient);
    }

    // Registra un nuevo paciente en el sistema.
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

    // Actualiza el correo electrónico de un paciente. (Necesario para front)
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

    // Actualiza la contraseña de un paciente. (Necesario para front)
    public void UpdatePatientPassword(int id, UpdatePatientPasswordRequest request)
    {
        var patient = _patientRepository.GetById(id)
            ?? throw new NotFoundException("PATIENT_NOT_FOUND");

        if (!_hasher.VerifyPassword(request.CurrentPassword, patient.Password!))
            throw new AppValidationException("CURRENT_PASSWORD_INCORRECT");

        patient.SetPassword(_hasher.HashPassword(request.NewPassword));
        _patientRepository.Update(patient);
    }


    // Crea un nuevo paciente desde el panel del dentista. (Necesario para front)
    public ActivationResponseDto<PatientDto> CreatePatientByDentist(CreatePatientByDentistRequest request)
    {
        if (_userRepository.GetByEmail(request.Email) != null)
            throw new AppValidationException("EMAIL_ALREADY_EXISTS");

        if (_patientRepository.GetByDni(request.Dni) != null)
            throw new AppValidationException("DNI_ALREADY_EXISTS");

        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        if (request.BirthDate.HasValue && request.BirthDate.Value > today)
            throw new AppValidationException("INVALID_BIRTHDATE_FUTURE");

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

        return new ActivationResponseDto<PatientDto>(PatientDto.Create(saved!), activationToken);
    }

    // Genera una contraseña temporal aleatoria para nuevos pacientes.
    private string GenerateTemporaryPassword()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var random = new Random();
        return "Tmp-" + new string(Enumerable.Repeat(chars, 10).Select(s => s[random.Next(s.Length)]).ToArray());
    }

    // Activa la cuenta de un paciente mediante un token recibido por correo electrónico.
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

    // Actualiza la información de un paciente por parte del dentista.  
    public PatientDto UpdatePatient(int id, UpdatePatientRequest request)
    {
        var patient = _patientRepository.GetById(id)
            ?? throw new NotFoundException("PATIENT_NOT_FOUND");

        if (!string.IsNullOrEmpty(request.Email) &&
            _userRepository.GetByEmail(request.Email) != null &&
            request.Email != patient.Email)
            throw new AppValidationException("EMAIL_ALREADY_EXISTS");

        if (!string.IsNullOrEmpty(request.Dni))
        {
            var existingPatient = _patientRepository.GetByDni(request.Dni);
            if (existingPatient != null && existingPatient.Id != id)
                throw new AppValidationException("DNI_ALREADY_EXISTS");
        }

        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        if (request.BirthDate.HasValue && request.BirthDate.Value > today)
            throw new AppValidationException("INVALID_BIRTHDATE_FUTURE");


        patient.UpdatePersonalInfo(
            request.FirstName, request.LastName, request.Email, request.Dni,
            request.Address, request.PhoneNumber, request.City,
            request.MembershipNumber, request.BirthDate, request.HealthPlanId
        );

        _patientRepository.Update(patient);

        var saved = _patientRepository.GetById(patient.Id);

        return PatientDto.Create(saved!);
    }
}



