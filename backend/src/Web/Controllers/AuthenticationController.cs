using Microsoft.AspNetCore.Mvc;
using Application.Interfaces;
using Application.Models.Requests;
using Application.Models;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Application.Services;
using Web.Models.Requests;
using Web.Models;

[Route("api/authentication")]
[ApiController]
public class AuthenticationController : ControllerBase
{
    private readonly IAuthenticationService _authService;
    private readonly DentistService _dentistService;

    private readonly IPatientService _patientService;

    public AuthenticationController(IAuthenticationService authService, DentistService dentistService, IPatientService patientService)
    {
        _authService = authService;
        _dentistService = dentistService;
        _patientService = patientService;
    }

    [HttpPost("login")]
    public ActionResult<AuthenticationResponseDto> Login([FromBody] AuthenticationRequest dto)
    {
        var response = _authService.Authenticate(dto);
        if (response == null) 
            return Unauthorized("Email o contraseña incorrectos o usuario inactivo.");

        return Ok(response);
    }

    [HttpPost("register-patient")]
    public ActionResult<Patient> RegisterPatient([FromBody] RegisterPatientRequest dto)
    {
        try
        {
            var patient = _patientService.RegisterPatient(dto);
            return Ok(patient);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("create-dentist")]
    [Authorize(Roles = "SuperAdmin")]
    public ActionResult<DentistDto> CreateDentist([FromBody] CreateDentistRequest dentistDto)
    {
        var dentist = _dentistService.CreateDentist(
            dentistDto.FirstName,
            dentistDto.LastName,
            dentistDto.Email,
            dentistDto.LicenseNumber
            );

        var dto = DentistDto.Create(dentist);
        return Ok(dto);
    }

    [HttpPost("activate-dentist")]
    public ActionResult ActivateDentist([FromBody] ActivateDentistRequest dto)
    {
        _dentistService.ActivateDentist(dto.Token, dto.Password);
        
        return NoContent();
    }
}
