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

        // Obtiene todas las obras sociales registradas en el sistema.
        public List<HealthInsuranceDto> GetAllInsurances()
        {
            var insurances = _healthInsuranceRepository.GetAll();

            if (!insurances.Any())
                return new List<HealthInsuranceDto>();

            return HealthInsuranceDto.CreateList(insurances);
        }

        // Obtiene la información de una obra social específica junto con sus planes.
        public HealthInsuranceDto GetById(int id)
        {
            var insurance = _healthInsuranceRepository.GetByIdWithPlans(id)
                ?? throw new NotFoundException("HEALTH_INSURANCE_NOT_FOUND");
            return HealthInsuranceDto.Create(insurance);
        }
    }
}
