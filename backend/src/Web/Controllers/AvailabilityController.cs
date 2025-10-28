using Application.Interfaces;
using Application.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Application.Models.Requests;

namespace Web.Controllers
{
    [ApiController]
    [Route("api/availabilities")]
    [Authorize(Roles = "Dentist, SuperAdmin")]
    public class AvailabilityController : ControllerBase
    {
        private readonly IAvailabilityService _availabilityService;

        public AvailabilityController(IAvailabilityService availabilityService)
        {
            _availabilityService = availabilityService;
        }

        [HttpGet("{dentistId}")]
        public ActionResult<IEnumerable<AvailabilityDto>> GetByDentistId(int dentistId)
        {
            var slots = _availabilityService.GetByDentistId(dentistId);
            return Ok(slots);
        }

        [HttpPost("{dentistId}")]
        public IActionResult SetAvailability(int dentistId, [FromBody] List<AvailabilityRequest> slots)
        {
            _availabilityService.SetAvailability(dentistId, slots);
            return Ok();
        }
    }
}

