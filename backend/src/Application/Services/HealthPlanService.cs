using Application.Interfaces;
using Application.Models;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;

namespace Application.Services
{
    public class HealthPlanService : IHealthPlanService
    {
        private readonly IHealthPlanRepository _healthPlanRepository;

        public HealthPlanService(IHealthPlanRepository healthPlanRepository)
        {
            _healthPlanRepository = healthPlanRepository;
        }

        public IEnumerable<HealthPlanDto> GetAll()
        {
            var plans = _healthPlanRepository.GetAll();

            if (plans == null || !plans.Any())
                throw new NotFoundException("HEALTH_PLAN_NOT_FOUND");

            return plans.Select(plan => new HealthPlanDto(plan.Id, plan.Name));
        }

        public IEnumerable<HealthPlanDto> GetByInsuranceId(int healthInsuranceId)
        {
            var plans = _healthPlanRepository.GetByInsuranceId(healthInsuranceId);

            if (plans == null || !plans.Any())
                throw new NotFoundException("HEALTH_PLAN_NOT_FOUND");

            return plans.Select(plan => new HealthPlanDto(plan.Id, plan.Name));
        }
    }
}
