using Application.Models;
using Application.Models.Requests;

namespace Application.Interfaces;

public interface IDentistService
{
    List<DentistDto> GetAllDentists();
    DentistDto GetDentistById(int id);
    ActivationResponseDto<DentistDto> CreateDentist(CreateDentistRequest request);
    DentistDto UpdateDentist(int id, UpdateDentistRequest request);
    void ActivateDentist(string token, string password);
    DentistDto SetActiveStatusByAdmin(int id, bool isActive);
}
