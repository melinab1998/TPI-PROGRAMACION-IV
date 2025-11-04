using Application.Models; 

namespace Application.Interfaces
{
    public interface IHealthInsuranceService
    {
        List<HealthInsuranceDto> GetAllInsurances();
        HealthInsuranceDto GetById(int id);
    }
}

