using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class HealthPlanRepository : Repository<HealthPlan>, IHealthPlanRepository
{
    public HealthPlanRepository(ApplicationDbContext applicationDbcontext) : base(applicationDbcontext) { }

    public IEnumerable<HealthPlan> GetAll()
    {
        return _applicationDbcontext.HealthPlans
        .Include(p => p.HealthInsurance) 
        .ToList();
    }

    public IEnumerable<HealthPlan> GetByInsuranceId(int healthInsuranceId)
    {
        return _applicationDbcontext.HealthPlans
        .Where(p => p.HealthInsuranceId == healthInsuranceId)
        .Include(p => p.HealthInsurance) 
        .ToList();
    }
}
