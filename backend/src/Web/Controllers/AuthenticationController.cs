using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Domain.Entities;
using Web.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthenticationController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IDentistService _dentistService;
    private readonly IPatientService _patientService;

    public AuthenticationController(
        IUserService userService,
        IDentistService dentistService,
        IPatientService patientService)
    {
        _userService = userService;
        _dentistService = dentistService;
        _patientService = patientService;
    }

    [HttpPost("login")]
    public ActionResult<AuthenticationDto> Login([FromBody] AuthenticationRequest dto)
    {
        var user = _userService.Authenticate(dto.Email, dto.Password);

        var response = new AuthenticationDto(
            user.Token,
            user.GetType().Name
        );

        return Ok(response);
    }

    [HttpPost("register-patient")]
    public ActionResult<PatientDto> RegisterPatient([FromBody] RegisterPatientRequest patientDto)
    {
        var newPatient = _patientService.RegisterPatient(patientDto);

        return CreatedAtAction(
            nameof(PatientController.GetPatientById),
            "Patient",
            new { id = newPatient.Id },
            newPatient
        );
    }

    [HttpPost("create-patient")]
    [Authorize(Roles = "Dentist, SuperAdmin")]
    public ActionResult<PatientDto> CreatePatientByDentist([FromBody] CreatePatientByDentistRequest request)
    {
        var newPatient = _patientService.CreatePatientByDentist(request);

        return CreatedAtAction(
            nameof(PatientController.GetPatientById),
            "Patient",
            new { id = newPatient.Id },
            newPatient
        );
    }

    [HttpPost("activate-patient")]
    public IActionResult ActivatePatient([FromBody] ActivatePatientRequest dto)
    {
        _patientService.ActivatePatient(dto.Token, dto.Password);
        return NoContent();
    }

    [HttpPost("create-dentist")]
    [Authorize(Roles = "SuperAdmin")]
    public ActionResult<DentistDto> CreateDentist([FromBody] CreateDentistRequest dentistDto)
    {
        var newDentist = _dentistService.CreateDentist(dentistDto);

        return CreatedAtAction(
            nameof(DentistController.GetDentistById),
            "Dentist",
            new { id = newDentist.Id },
            newDentist
        );
    }

    [HttpPost("activate-dentist")]
    public IActionResult ActivateDentist([FromBody] ActivateDentistRequest dto)
    {
        _dentistService.ActivateDentist(dto.Token, dto.Password);
        return NoContent();
    }
}
