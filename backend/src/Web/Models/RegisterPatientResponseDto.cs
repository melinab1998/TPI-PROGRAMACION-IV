using Domain.Entities;

namespace Web.Models;

public record PatientDto(int Id, string FirstName, string LastName, string Email, string Dni)
{
    public static PatientDto Register(Patient entity)
    {
        var dto = new PatientDto(entity.Id, entity.FirstName, entity.LastName, entity.Email, entity.Dni);

        return dto;
    }

   
}