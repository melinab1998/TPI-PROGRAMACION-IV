using Microsoft.AspNetCore.Mvc;
using Application.Interfaces;
using Web.Models;
using Web.Models.Requests;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;

[Route("api/availabilities")]
[ApiController]
[Authorize(Roles = "Dentist")] // Solo dentistas pueden modificar sus horarios
public class AvailabilityController : ControllerBase
{
    private readonly IAvailabilityService _availabilityService;

    public AvailabilityController(IAvailabilityService availabilityService)
    {
        _availabilityService = availabilityService;
    }

    // GET api/availabilities/{dentistId}
    [HttpGet("{dentistId}")]
    public ActionResult<IEnumerable<AvailabilityDto>> GetByDentistId([FromRoute] int dentistId)
    {
        var slots = _availabilityService.GetByDentistId(dentistId);
        var dtoList = slots.Select(AvailabilityDto.Create).ToList();
        return Ok(dtoList);
    }

    // POST api/availabilities/{dentistId}
    [HttpPost("{dentistId}")]
    public ActionResult SetAvailability([FromRoute] int dentistId, [FromBody] List<AvailabilityRequest> requests)
    {
        var slots = requests.Select(r => new Availability(
            r.DayOfWeek,
            r.StartTime,
            r.EndTime,
            dentistId
        )).ToList();

        _availabilityService.SetAvailability(dentistId, slots);

        return NoContent(); // No necesitamos devolver nada, los slots ya fueron guardados
    }
}
