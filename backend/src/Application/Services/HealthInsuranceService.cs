using Application.Interfaces;
using Application.Models;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;

namespace Application.Services
{
    public class HealthInsuranceService : IHealthInsuranceService
    {
        private readonly IHealthInsuranceRepository _healthInsuranceRepository;

        public HealthInsuranceService(IHealthInsuranceRepository healthInsuranceRepository)
        {
            _healthInsuranceRepository = healthInsuranceRepository;
        }

        public IEnumerable<HealthInsuranceDto> GetAll()
        {
            var insurances = _healthInsuranceRepository.GetAll();

            if (insurances == null || !insurances.Any())
                throw new NotFoundException("HEALTH_INSURANCE_NOT_FOUND");

            return insurances.Select(insurance => new HealthInsuranceDto(
                insurance.Id,
                insurance.Name,
                insurance.Plans?.Select(plan => new HealthPlanDto(plan.Id, plan.Name)) ?? Enumerable.Empty<HealthPlanDto>()
            ));
        }

        public HealthInsuranceDto GetById(int id)
        {
            var insurance = _healthInsuranceRepository.GetByIdWithPlans(id);

            if (insurance == null)
                throw new NotFoundException("HEALTH_INSURANCE_NOT_FOUND");

            return new HealthInsuranceDto(
                insurance.Id,
                insurance.Name,
                insurance.Plans?.Select(plan => new HealthPlanDto(plan.Id, plan.Name)) ?? Enumerable.Empty<HealthPlanDto>()
            );
        }
    }
}
