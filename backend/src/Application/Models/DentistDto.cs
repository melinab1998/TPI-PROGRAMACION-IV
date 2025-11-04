using Domain.Entities;

namespace Application.Models;

public record DentistDto(int Id, string FirstName, string LastName, string Email, string LicenseNumber, bool IsActive)
{
    public static DentistDto Create(Dentist entity)
    {
        var dto = new DentistDto(entity.Id, entity.FirstName, entity.LastName, entity.Email, entity.LicenseNumber, entity.IsActive);

        return dto;
    }

    public static List<DentistDto> CreateList(IEnumerable<Dentist> dentists)
    {
        return dentists.Select(dentist => Create(dentist)).ToList();
    }
}