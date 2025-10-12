using Microsoft.AspNetCore.Mvc;
using Application.Interfaces;
using Application.Models.Requests;
using Application.Models;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;

[Route("api/authentication")]
[ApiController]
public class AuthenticationController : ControllerBase
{
    private readonly IAuthenticationService _authService;
    private readonly IDentistService _dentistService;

    private readonly IPatientService _patientService;

    public AuthenticationController(IAuthenticationService authService, IDentistService dentistService, IPatientService patientService)
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
    public async Task<ActionResult<Dentist>> CreateDentist([FromBody] CreateDentistRequest dto)
    {
        try
        {
            var dentist = await _dentistService.CreateDentist(dto);
            return Ok(dentist);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("activate-dentist")]
    public async Task<ActionResult> ActivateDentist([FromBody] ActivateDentistRequest dto)
    {
          Console.WriteLine($"Token recibido: {dto.Token}");
        Console.WriteLine($"Password recibido: {dto.Password}");
        try
        {
            await _dentistService.ActivateDentist(dto);
            return Ok(new { message = "Cuenta activada correctamente." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
