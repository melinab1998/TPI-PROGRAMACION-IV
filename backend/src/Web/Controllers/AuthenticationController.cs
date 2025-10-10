using Microsoft.AspNetCore.Mvc;
using Application.Interfaces;
using Application.Models.Requests;
using Application.Models;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Infrastructure.Services;

[Route("api/authentication")]
[ApiController]
public class AuthenticationController : ControllerBase
{
    private readonly AutenticacionService _authService;

    public AuthenticationController(AutenticacionService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public ActionResult<AuthenticationResponseDto> Login([FromBody] AuthenticationRequest dto)
    {
        var response = _authService.Authenticate(dto);
        if (response == null) return Unauthorized("Email o contraseña incorrectos o usuario inactivo.");
        return Ok(response);
    }

    [HttpPost("register-patient")]
    public ActionResult<Patient> RegisterPatient([FromBody] RegisterPatientRequest dto)
    {
        try
        {
            var patient = _authService.RegisterPatient(dto);
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
            var dentist = await _authService.CreateDentist(dto);
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
        try
        {
            await _authService.ActivateDentist(dto); 
            return Ok(new { message = "Cuenta activada correctamente." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}

