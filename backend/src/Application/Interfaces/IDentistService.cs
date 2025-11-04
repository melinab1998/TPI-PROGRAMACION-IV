using Application.Models;
using Application.Models.Requests;
using Domain.Entities;

namespace Application.Interfaces;

public interface IDentistService
{
    List<DentistDto> GetAllDentists();
    DentistDto GetDentistById(int id);
    DentistDto CreateDentist(CreateDentistRequest request);
    DentistDto UpdateDentist(int id, UpdateDentistRequest request);
    void ActivateDentist(string token, string password);
    DentistDto SetActiveStatusByAdmin(int id, bool isActive);
}
