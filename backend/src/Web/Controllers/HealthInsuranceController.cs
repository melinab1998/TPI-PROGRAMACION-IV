using Application.Interfaces;
using Application.Models;
using Microsoft.AspNetCore.Mvc;

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
        public ActionResult<IEnumerable<HealthInsuranceDto>> GetAll()
        {
            var result = _healthInsuranceService.GetAllInsurances();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public ActionResult<HealthInsuranceDto> GetByIdWithPlans(int id)
        {
            var result = _healthInsuranceService.GetById(id);
            return Ok(result);
        }
    }
}

