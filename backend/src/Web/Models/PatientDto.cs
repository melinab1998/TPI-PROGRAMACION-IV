using Domain.Entities;

namespace Web.Models;

public record PatientDtoFull(
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
    int? HealthPlanId
)
{
    public static PatientDtoFull Create(Patient entity)
    {
        var dto = new PatientDtoFull(
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
            entity.HealthPlanId
        );

        return dto;
    }
}

