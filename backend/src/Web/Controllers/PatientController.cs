using Microsoft.AspNetCore.Mvc;
using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Microsoft.AspNetCore.Authorization;

namespace Web.Controllers;

[Route("api/patients")]
[ApiController]
public class PatientController : ControllerBase
{
    private readonly IPatientService _patientService;

    public PatientController(IPatientService patientService)
    {
        _patientService = patientService;
    }

    [HttpGet]
    [Authorize(Roles = "Dentist")]
    public ActionResult<IEnumerable<PatientDto>> GetAllPatients()
    {
        return Ok(_patientService.GetAllPatients());
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Dentist, Patient")]
    public ActionResult<PatientDto> GetPatientById([FromRoute] int id)
    {
        return Ok(_patientService.GetPatientById(id));
    }


    [HttpPut("{id}")]
    [Authorize(Roles = "Dentist")]
    public ActionResult<PatientDto> UpdatePatient([FromRoute] int id, [FromBody] UpdatePatientRequest request)
    {
        var updated = _patientService.UpdatePatient(id, request);
        return Ok(updated);
    }

    [HttpPut("{id}/email")]
    [Authorize(Roles = "Patient")]
    public ActionResult<PatientDto> UpdatePatientEmail([FromRoute] int id, [FromBody] UpdatePatientEmailRequest request)
    {
        var updated = _patientService.UpdatePatientEmail(id, request);
        return Ok(updated);
    }

    [HttpPut("{id}/password")]
    [Authorize(Roles = "Patient")]
    public IActionResult UpdatePatientPassword([FromRoute] int id, [FromBody] UpdatePatientPasswordRequest request)
    {
        _patientService.UpdatePatientPassword(id, request);
        return NoContent();
    }
}
