using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Web.Models.Requests;
using Web.Models;

namespace Web.Controllers
{
    [ApiController]
    [Route("api/healhplans")]
    public class HealthPlanController : ControllerBase
    {
        private readonly IHealthPlanService _healthPlanService;

        public HealthPlanController(IHealthPlanService healthPlanService)
        {
            _healthPlanService = healthPlanService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<HealthPlanResponseDto>> GetAll()
        {
            var plans = _healthPlanService.GetAll();
            var result = plans.Select(p => new HealthPlanResponseDto(p.Id, p.Name, p.HealthInsuranceId));
            return Ok(result);
        }

        [HttpGet("byInsurance/{insuranceId}")]
        public ActionResult<IEnumerable<HealthPlanResponseDto>> GetByInsuranceId(int insuranceId)
        {
            var plans = _healthPlanService.GetByInsuranceId(insuranceId);
            var result = plans.Select(p => new HealthPlanResponseDto(p.Id, p.Name, p.HealthInsuranceId));
            return Ok(result);
        }

    }
}
