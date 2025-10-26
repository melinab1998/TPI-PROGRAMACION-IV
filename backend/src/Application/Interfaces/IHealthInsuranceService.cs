using Application.Models; 

namespace Application.Interfaces
{
    public interface IHealthInsuranceService
    {
        IEnumerable<HealthInsuranceDto> GetAll();
        HealthInsuranceDto GetById(int id);
    }
}

