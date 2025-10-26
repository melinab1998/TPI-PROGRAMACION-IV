using Application.Models;
using Application.Models.Requests;
using Domain.Entities;

namespace Application.Interfaces;

public interface IDentistService
{
    DentistDto CreateDentist(CreateDentistRequest request);
    void ActivateDentist(string token, string password);
    DentistDto GetDentistById(int id);
    IEnumerable<DentistDto> GetAllDentists();
    DentistDto UpdateDentist(int id, UpdateDentistRequest request);
    DentistDto SetActiveStatusByAdmin(int id, bool isActive);
}
