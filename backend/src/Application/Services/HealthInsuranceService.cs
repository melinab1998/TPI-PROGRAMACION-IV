using Application.Interfaces;
using Application.Models;
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

        //Obtener todas las obras sociales
        public List<HealthInsuranceDto> GetAllInsurances()
        {
            var insurances = _healthInsuranceRepository.GetAll();

            if (!insurances.Any())
                return new List<HealthInsuranceDto>();

            return HealthInsuranceDto.CreateList(insurances);
        }

        //Obtener una obra social en especifico
        public HealthInsuranceDto GetById(int id)
        {
            var insurance = _healthInsuranceRepository.GetByIdWithPlans(id)
                ?? throw new NotFoundException("HEALTH_INSURANCE_NOT_FOUND");
            return HealthInsuranceDto.Create(insurance);
        }
    }
}
