using Domain.Entities;

namespace Application.Interfaces;

public interface IHealthInsurance
{
    IEnumerable<HealthInsurance> GetAll();
    HealthInsurance GetById(int id);
}
