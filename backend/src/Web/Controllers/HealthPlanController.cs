using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Web.Models.Requests;
using Web.Models;

namespace Web.Controllers
{
    [ApiController]
    [Route("api/healthplans")]
    public class HealthPlanController : ControllerBase
    {
        private readonly IHealthPlanService _healthPlanService;

        public HealthPlanController(IHealthPlanService healthPlanService)
        {
            _healthPlanService = healthPlanService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<HealthPlanDto>> GetAll()
        {
            var plans = _healthPlanService.GetAll();
            var result = plans.Select(p => new HealthPlanDto(p.Id, p.Name));
            return Ok(result);
        }

        [HttpGet("byInsurance/{insuranceId}")]
        public ActionResult<IEnumerable<HealthPlanDto>> GetByInsuranceId(int insuranceId)
        {
            var plans = _healthPlanService.GetByInsuranceId(insuranceId);
            var result = plans.Select(p => new HealthPlanDto(p.Id, p.Name));
            return Ok(result);
        }

    }
}
