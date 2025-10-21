using Application.Interfaces;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;

namespace Application.Services;

public class HealthPlanService : IHealthPlan
{
    private readonly IHealthPlanRepository _healthPlanRepository;

    public HealthPlanService(IHealthPlanRepository healthPlanRepository)
    {
        _healthPlanRepository = healthPlanRepository;
    }

    public IEnumerable<HealthPlan> GetAll()
    {
        var plans = _healthPlanRepository.GetAll();

        if (plans == null || !plans.Any())
            throw new AppValidationException("No se encontraron planes de salud.");

        return plans;
    }

    
    public IEnumerable<HealthPlan> GetByInsuranceId(int healthInsuranceId)
    {
        
        if (healthInsuranceId <= 0)
            throw new AppValidationException("Id de obra social inválido.");

        var plans = _healthPlanRepository.GetByInsuranceId(healthInsuranceId);

        if (plans == null || !plans.Any())
            throw new AppValidationException("No se encontraron planes para la obra social especificada.");

        return plans;
    }

    
}
