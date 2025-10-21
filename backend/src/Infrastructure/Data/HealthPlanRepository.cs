using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class HealthPlanRepository : IHealthPlanRepository
{
    private readonly ApplicationDbContext _context;

    public HealthPlanRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public IEnumerable<HealthPlan> GetAll()
    {
        return _context.HealthPlans
                       .Include(p => p.HealthInsurance) // Trae la obra social asociada
                       .ToList();
    }

    public IEnumerable<HealthPlan> GetByInsuranceId(int healthInsuranceId)
    {
        return _context.HealthPlans
                       .Where(p => p.HealthInsuranceId == healthInsuranceId)
                       .Include(p => p.HealthInsurance) // Trae la obra social asociada
                       .ToList();
    }
}
