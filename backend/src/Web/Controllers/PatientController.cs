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
    public ActionResult<IEnumerable<PatientDto>> GetAllPatients()
    {
        return Ok(_patientService.GetAllPatients());
    }

    [HttpGet("{id}")]
    public ActionResult<PatientDto> GetPatientById([FromRoute] int id)
    {
        return Ok(_patientService.GetPatientById(id));
    }

    [HttpPost("register")]
    public ActionResult<PatientDto> RegisterPatient([FromBody] RegisterPatientRequest request)
    {
        var created = _patientService.RegisterPatient(request);
        return CreatedAtAction(nameof(GetPatientById), new { id = created.Id }, created);
    }

    [HttpPost("create-by-dentist")]
    [Authorize(Roles = "Dentist,SuperAdmin")]
    public ActionResult<PatientDto> CreatePatientByDentist([FromBody] CreatePatientByDentistRequest request)
    {
        var created = _patientService.CreatePatientByDentist(request);
        return CreatedAtAction(nameof(GetPatientById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "SuperAdmin, Dentist")]
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
