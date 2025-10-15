using Domain.Entities;

namespace Web.Models;

public record DentistDto(int Id, string FirstName, string LastName, string Email, string LicenseNumber)
{
    public static DentistDto Create(Dentist entity)
    {
        var dto = new DentistDto(entity.Id, entity.FirstName, entity.LastName, entity.Email, entity.LicenseNumber);

        return dto;
    }

   
}