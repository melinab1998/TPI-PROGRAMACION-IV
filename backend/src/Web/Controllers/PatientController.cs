using Microsoft.AspNetCore.Mvc;
using Application.Interfaces;
using Web.Models;
using Web.Models.Requests;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;

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
        var patients = _patientService.GetAllPatients();
        var dtoList = patients.Select(PatientDto.Create).ToList();
        return Ok(dtoList);
    }

    [HttpGet("{id}")]
    public ActionResult<PatientDto> GetPatientById([FromRoute] int id)
    {
        var patient = _patientService.GetPatientById(id);
        var dto = PatientDto.Create(patient);
        return Ok(dto);
    }

    //Puede actualizar paciente completo. Desde dentista.

    [HttpPut("{id}")]
    [Authorize(Roles = "SuperAdmin, Dentist")]
    public ActionResult<PatientDto> UpdatePatient([FromRoute] int id, [FromBody] UpdatePatientRequest request)
    {
        var updatedPatient = _patientService.UpdatePatient(
            id,
            request.FirstName,
            request.LastName,
            request.Email,
            request.Address,
            request.PhoneNumber,
            request.City,
            request.MembershipNumber,
            request.BirthDate,
            request.HealthPlanId 
        );

        var dto = PatientDto.Create(updatedPatient);
        return Ok(dto);
    }

    //Actualiza sólo email. Desde perfil de paciente.

    [HttpPut("{id}/email")]
    public ActionResult<PatientDto> UpdatePatientEmail([FromRoute] int id, [FromBody] UpdatePatientEmailRequest request)
    {
        var updatedPatient = _patientService.UpdatePatientEmail(id, request.Email);
        var dto = PatientDto.Create(updatedPatient);
        return Ok(dto);
    }

    //Actualiza sólo contraseña. Desde perfil de paciente.

    [HttpPut("{id}/password")]
    public IActionResult UpdatePatientPassword([FromRoute] int id, [FromBody] UpdatePatientPasswordRequest request)
    {
        _patientService.UpdatePatientPassword(id, request.CurrentPassword, request.NewPassword);
        return NoContent(); 
    }

}