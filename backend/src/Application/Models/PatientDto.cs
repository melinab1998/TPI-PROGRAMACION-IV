using Domain.Entities;

namespace Application.Models;

public record PatientDto(
    int Id,
    string FirstName,
    string LastName,
    string Email,
    string Dni,
    DateOnly? BirthDate,
    string? Address,
    string? PhoneNumber,
    string? City,
    string? MembershipNumber,
    int? HealthPlanId,
    string? HealthPlanName,
    int? HealthInsuranceId,
    string? HealthInsuranceName
)
{
    public static PatientDto Create(Patient entity)
    {
        return new PatientDto(
            entity.Id,
            entity.FirstName,
            entity.LastName,
            entity.Email,
            entity.Dni,
            entity.BirthDate,
            entity.Address,
            entity.PhoneNumber,
            entity.City,
            entity.MembershipNumber,
            entity.HealthPlanId,
            entity.HealthPlan?.Name,
            entity.HealthPlan?.HealthInsuranceId,
            entity.HealthPlan?.HealthInsurance?.Name
        );
    }

    public static List<PatientDto> CreateList(IEnumerable<Patient> patients)
    {
        return patients.Select(patient => Create(patient)).ToList();
    }
}

