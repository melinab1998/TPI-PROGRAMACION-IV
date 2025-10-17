using Application.Interfaces;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;

namespace Application.Services;

public class PatientService : IPatientService
{
    private readonly IPatientRepository _patientRepository;
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _hasher;

    public PatientService(
        IPatientRepository patientRepository,
        IUserRepository userRepository,
        IPasswordHasher hasher)
    {
        _patientRepository = patientRepository;
        _userRepository = userRepository;
        _hasher = hasher;
    }

    public Patient RegisterPatient(string FirstName, string LastName, string Email, string Password, string Dni)
    {
        if (_userRepository.GetByEmail(Email) != null)
            throw new AppValidationException($"El email {Email} ya está registrado");

        if (_patientRepository.GetByDni(Dni) != null)
            throw new AppValidationException($"El DNI {Dni} ya está registrado");

        var patient = new Patient(
            FirstName,
            LastName,
            Email,
            Dni
        );

        patient.SetPassword(_hasher.HashPassword(Password));

        _patientRepository.Add(patient);

        return patient;
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

        if (!string.IsNullOrEmpty(email) && _userRepository.GetByEmail(email) != null && email != patient.Email)
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

        if (_userRepository.GetByEmail(newEmail) != null && newEmail != patient.Email)
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
