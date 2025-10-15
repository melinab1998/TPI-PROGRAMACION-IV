/* using Application.Interfaces;
using Application.Models.Requests;
using Domain.Entities;
using Infrastructure.Data;

namespace Infrastructure.Services;
public class PatientService : IPatientService
{
    private readonly ApplicationDbContext _context;
    private readonly IPasswordHasher _hasher;

    public PatientService(ApplicationDbContext context, IPasswordHasher hasher)
    {
        _context = context;
        _hasher = hasher;
    }

    public Patient RegisterPatient(RegisterPatientRequest request)
    {
        var patient = new Patient(request.FirstName, request.LastName, request.Email, request.Dni);
        patient.SetPassword(_hasher.HashPassword(request.Password));

        patient.BirthDate = request.BirthDate;
        patient.Address = request.Address;
        patient.PhoneNumber = request.PhoneNumber;
        patient.City = request.City;
        patient.MembershipNumber = request.MembershipNumber;
        patient.HealthPlanId = request.HealthPlanId;

        _context.Patients.Add(patient);
        _context.SaveChanges();

        return patient;
    }
}
 */