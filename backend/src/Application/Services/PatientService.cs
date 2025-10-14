using Application.Interfaces;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;

namespace Application.Services;

public class PatientService
{
    private readonly IPatientRepository _patientRepository;
    private readonly IPasswordHasher _hasher;

    public PatientService(
        IPatientRepository patientRepository,
        IPasswordHasher hasher)
    {
        _patientRepository = patientRepository;
        _hasher = hasher;
    }

    public Patient RegisterPatient(string FirstName, string LastName, string Email, string Password, string Dni)
    {
        if (_patientRepository.GetByEmail(Email) != null)
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
}
