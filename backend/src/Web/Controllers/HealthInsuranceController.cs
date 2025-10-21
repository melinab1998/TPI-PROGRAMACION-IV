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

        // GET: api/HealthInsurance
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
        public ActionResult<HealthInsuranceResponseDto> GetById(int id)
        {
            var insurance = _healthInsuranceService.GetById(id);
            if (insurance == null) return NotFound();

            var response = new HealthInsuranceResponseDto(
                insurance.Id,
                insurance.Name,
                insurance.Plans.Select(p => new HealthPlanResponseDto(p.Id, p.Name))
            );

            return Ok(response);
        }
    }
}
