using Application.Interfaces;
using Application.Models;
using Microsoft.AspNetCore.Mvc;

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
            var result = _healthPlanService.GetAll();
            return Ok(result);
        }

        [HttpGet("byInsurance/{insuranceId}")]
        public ActionResult<IEnumerable<HealthPlanDto>> GetByInsuranceId(int insuranceId)
        {
            var result = _healthPlanService.GetByInsuranceId(insuranceId);
            return Ok(result);
        }
    }
}
