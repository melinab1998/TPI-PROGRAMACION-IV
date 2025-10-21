using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class HealthInsuranceRepository : IHealthInsuranceRepository
{
    private readonly ApplicationDbContext _applicationDbcontext;

    public HealthInsuranceRepository(ApplicationDbContext applicationDbcontext)
    {
        _applicationDbcontext = applicationDbcontext;
    }

    public IEnumerable<HealthInsurance> GetAll()
    {
        return _applicationDbcontext.HealthInsurances
                       .Include(h => h.Plans) 
                       .ToList();
    }

    public HealthInsurance? GetById(int id)
    {
        return _applicationDbcontext.HealthInsurances
                       .Include(h => h.Plans) 
                       .FirstOrDefault(h => h.Id == id);
    }
}
