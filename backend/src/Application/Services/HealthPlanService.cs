using Application.Interfaces;
using Application.Models;
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

        //Obtener todos los planes
        public List<HealthPlanDto> GetAllPlans()
        {
            var plans = _healthPlanRepository.GetAll();

            if (!plans.Any())
                return new List<HealthPlanDto>();

            return HealthPlanDto.CreateList(plans);

        }

        //Obtener los planes con el id de la obra social
        public IEnumerable<HealthPlanDto> GetByInsuranceId(int healthInsuranceId)
        {
            var plans = _healthPlanRepository.GetByInsuranceId(healthInsuranceId)
                ?? throw new NotFoundException("HEALTH_PLAN_NOT_FOUND");
            return plans.Select(plan => new HealthPlanDto(plan.Id, plan.Name));
        }
    }
}
