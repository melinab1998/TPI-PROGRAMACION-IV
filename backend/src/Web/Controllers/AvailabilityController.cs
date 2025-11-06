using Application.Interfaces;
using Application.Models;
using Microsoft.AspNetCore.Mvc;
using Application.Models.Requests;
using Microsoft.AspNetCore.Authorization;

namespace Web.Controllers
{
    [ApiController]
    [Route("api/availabilities")]
    public class AvailabilityController : ControllerBase
    {
        private readonly IAvailabilityService _availabilityService;

        public AvailabilityController(IAvailabilityService availabilityService)
        {
            _availabilityService = availabilityService;
        }

        [HttpGet("{dentistId}")]
        [Authorize(Roles = "SuperAdmin, Dentist")]
        public ActionResult<IEnumerable<AvailabilityDto>> GetByDentistId(int dentistId)
        {
            var slots = _availabilityService.GetByDentistId(dentistId);
            return Ok(slots);
        }

        [HttpPost("{dentistId}")]
        [Authorize(Roles = "SuperAdmin, Dentist")]
        public ActionResult<IEnumerable<AvailabilityDto>> CreateAvailability(int dentistId, [FromBody] List<AvailabilityRequest> slots)
        {
            var created = _availabilityService.CreateAvailability(dentistId, slots);
            return CreatedAtAction(nameof(GetByDentistId), new { dentistId }, created);
        }

        [HttpPut("{slotId}")]
        [Authorize(Roles = "SuperAdmin, Dentist")]
        public IActionResult UpdateAvailability(int slotId, [FromBody] AvailabilityRequest updatedSlot)
        {
            return Ok(_availabilityService.UpdateAvailability(slotId, updatedSlot));
        }

        //Necesario para el front

        [HttpGet("{dentistId}/available-slots")]
        [Authorize(Roles = "SuperAdmin, Dentist, Patient")]
        public ActionResult<Dictionary<string, List<string>>> GetAvailableSlots(int dentistId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var availableSlots = _availabilityService.GetAvailableSlots(dentistId, startDate, endDate);
            return Ok(availableSlots);
        }

        [HttpDelete("{slotId}")] 
        [Authorize(Roles = "SuperAdmin, Dentist")]
        public IActionResult DeleteAvailability(int slotId)
        {
            _availabilityService.DeleteAvailability(slotId);
            return NoContent();
        }

    }
}

