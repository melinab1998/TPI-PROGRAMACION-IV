using Application.Interfaces;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;
using System.Linq;

namespace Application.Services;

public class PatientService : IPatientService
{
    private readonly IPatientRepository _patientRepository;
    private readonly IPasswordHasher _hasher;
    private readonly IEmailService _emailService;
    private readonly IJwtService _jwtService;

    public PatientService(
        IPatientRepository patientRepository,
        IPasswordHasher hasher,
        IEmailService emailService,
        IJwtService jwtService)
    {
        _patientRepository = patientRepository;
        _hasher = hasher;
        _emailService = emailService;
        _jwtService = jwtService;
    }

    public Patient RegisterPatient(string firstName, string lastName, string email, string password, string dni)
    {
        if (_patientRepository.GetByEmail(email) != null)
            throw new AppValidationException($"El email {email} ya está registrado");

        if (_patientRepository.GetByDni(dni) != null)
            throw new AppValidationException($"El DNI {dni} ya está registrado");

        var patient = new Patient(firstName, lastName, email, dni);
        patient.SetPassword(_hasher.HashPassword(password));

        _patientRepository.Add(patient);

        return patient;
    }

    // CREAR PACIENTE DESDE DENTISTA
    public Patient CreatePatientByDentist(
    string firstName,
    string lastName,
    string email,
    string dni,
    string? address = null,
    string? phoneNumber = null,
    string? city = null,
    string? membershipNumber = null,
    DateOnly? birthDate = null
)
    {
        if (_patientRepository.GetByEmail(email) != null)
            throw new AppValidationException($"El email {email} ya está registrado");

        if (_patientRepository.GetByDni(dni) != null)
            throw new AppValidationException($"El DNI {dni} ya está registrado");

        var patient = new Patient(firstName, lastName, email, dni)
        {
            Address = address,
            PhoneNumber = phoneNumber,
            City = city,
            MembershipNumber = membershipNumber,
            BirthDate = birthDate
        };

        var tempPassword = GenerateTemporaryPassword();
        patient.SetPassword(_hasher.HashPassword(tempPassword));

        _patientRepository.Add(patient);

        var activationToken = _jwtService.GenerateActivationTokenForPatient(patient.Id);
        _emailService.SendActivationEmailAsync(patient.Email, activationToken);

        return patient;
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
            throw new AppValidationException("Token inválido o patientId no encontrado.");

        int patientId = int.Parse(patientIdClaim.Value);
        var patient = _patientRepository.GetById(patientId);
        if (patient == null) throw new AppValidationException("Paciente no encontrado");

        patient.SetPassword(_hasher.HashPassword(password));
        _patientRepository.Update(patient);
    }

    public Patient GetPatientById(int id)
    {
        var patient = _patientRepository.GetById(id);
        if (patient == null) throw new AppValidationException("Paciente no encontrado");
        return patient;
    }

    public IEnumerable<Patient> GetAllPatients()
    {
        var patients = _patientRepository.List();
        if (patients == null || !patients.Any())
            throw new AppValidationException("No se encontraron pacientes registrados.");
        return patients;
    }

    public Patient UpdatePatient(
        int id,
        string? firstName,
        string? lastName,
        string? email,
        string? address,
        string? phoneNumber,
        string? city,
        string? membershipNumber,
        DateOnly? birthDate)
    {
        var patient = _patientRepository.GetById(id);
        if (patient == null)
            throw new AppValidationException("Paciente no encontrado");

        if (!string.IsNullOrEmpty(email) && _patientRepository.GetByEmail(email) != null && email != patient.Email)
            throw new AppValidationException($"El email {email} ya está registrado");

        if (!string.IsNullOrEmpty(firstName)) patient.FirstName = firstName;
        if (!string.IsNullOrEmpty(lastName)) patient.LastName = lastName;
        if (!string.IsNullOrEmpty(email)) patient.Email = email;
        if (!string.IsNullOrEmpty(address)) patient.Address = address;
        if (!string.IsNullOrEmpty(phoneNumber)) patient.PhoneNumber = phoneNumber;
        if (!string.IsNullOrEmpty(city)) patient.City = city;
        if (!string.IsNullOrEmpty(membershipNumber)) patient.MembershipNumber = membershipNumber;
        if (birthDate.HasValue) patient.BirthDate = birthDate;

        _patientRepository.Update(patient);

        return patient;
    }

    public Patient UpdatePatientEmail(int id, string newEmail)
    {
        var patient = _patientRepository.GetById(id);
        if (patient == null)
            throw new AppValidationException("Paciente no encontrado");

        if (_patientRepository.GetByEmail(newEmail) != null && newEmail != patient.Email)
            throw new AppValidationException($"El email {newEmail} ya está registrado");

        patient.Email = newEmail;
        _patientRepository.Update(patient);

        return patient;
    }

    public void UpdatePatientPassword(int id, string currentPassword, string newPassword)
    {
        var patient = _patientRepository.GetById(id);
        if (patient == null)
            throw new AppValidationException("Paciente no encontrado");

        if (!_hasher.VerifyPassword(currentPassword, patient.Password!))
            throw new AppValidationException("La contraseña actual es incorrecta");

        patient.SetPassword(_hasher.HashPassword(newPassword));
        _patientRepository.Update(patient);
    }
}
