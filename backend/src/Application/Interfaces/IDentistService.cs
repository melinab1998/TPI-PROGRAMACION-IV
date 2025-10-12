using Application.Models.Requests;
using Domain.Entities;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IDentistService
    {
        Task<Dentist> CreateDentist(CreateDentistRequest request);
        Task ActivateDentist(ActivateDentistRequest request);
        
    }
}
