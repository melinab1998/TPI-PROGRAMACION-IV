using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class HealthInsuranceRepository : Repository<HealthInsurance>, IHealthInsuranceRepository
{

    public HealthInsuranceRepository(ApplicationDbContext applicationDbcontext) : base(applicationDbcontext) { }


    public IEnumerable<HealthInsurance> GetAll()
    {
        return _applicationDbcontext.HealthInsurances
                       .Include(h => h.Plans)
                       .ToList();
    }

    public HealthInsurance? GetByIdWithPlans(int id)
    {
        return _applicationDbcontext.HealthInsurances
            .Include(h => h.Plans)
            .FirstOrDefault(h => h.Id == id);
    }


}
