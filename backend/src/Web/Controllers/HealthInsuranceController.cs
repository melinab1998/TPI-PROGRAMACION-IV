using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Web.Models.Requests;
using Web.Models;

namespace Web.Controllers
{
    [ApiController]
    [Route("api/healthinsurances")]
    public class HealthInsuranceController : ControllerBase
    {
        private readonly IHealthInsuranceService _healthInsuranceService;

        public HealthInsuranceController(IHealthInsuranceService healthInsuranceService)
        {
            _healthInsuranceService = healthInsuranceService;
        }

        
        [HttpGet]
        public ActionResult<IEnumerable<HealthInsuranceResponseDto>> GetAll()
        {
            var insurances = _healthInsuranceService.GetAll();
            var result = insurances.Select(h => new HealthInsuranceResponseDto(
                h.Id,
                h.Name,
                h.Plans.Select(p => new HealthPlanResponseDto(p.Id, p.Name))
            ));
            return Ok(result);
        }

        [HttpGet("{id}")]
        public ActionResult<HealthInsuranceResponseDto> GetByIdWithPlans(int id)
        {
            var insurance = _healthInsuranceService.GetById(id);
            
            var response = new HealthInsuranceResponseDto(
                insurance.Id,
                insurance.Name,
                insurance.Plans.Select(p => new HealthPlanResponseDto(p.Id, p.Name))
            );

            return Ok(response);
        }
    }
}
