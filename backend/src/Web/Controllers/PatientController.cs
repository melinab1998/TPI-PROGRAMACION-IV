using Microsoft.AspNetCore.Mvc;
using Application.Interfaces;
using Web.Models;
using Domain.Entities;

[Route("api/patients")]
[ApiController]
public class PatientController : ControllerBase
{
    private readonly IPatientService _patientService;

    public PatientController(IPatientService patientService)
    {
        _patientService = patientService;
    }

    [HttpGet("{id}")]
    public ActionResult<PatientDto> GetPatientById([FromRoute] int id)
    {
        var patient = _patientService.GetPatientById(id);
        var dto = PatientDto.RegisterPatient(patient);
        return Ok(dto);
    }
}