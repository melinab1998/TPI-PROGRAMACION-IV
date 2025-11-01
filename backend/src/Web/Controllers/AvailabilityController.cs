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

        //Devuelve horarios disponibles del dentista en x día.

        [HttpGet("{dentistId}/available-slots")]
        public ActionResult<IEnumerable<string>> GetAvailableSlots(int dentistId, [FromQuery] DateTime date)
        {
            var slots = _availabilityService.GetAvailableSlots(dentistId, date);
            return Ok(slots);
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
            _availabilityService.CreateAvailability(dentistId, slots);
            return Ok();
        }

        [HttpPut("{slotId}")]
        public IActionResult UpdateAvailability(int slotId, [FromBody] AvailabilityRequest updatedSlot)
        {
            _availabilityService.UpdateAvailability(slotId, updatedSlot);
            return Ok();
        }
    }
}

