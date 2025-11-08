using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
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
    public ActionResult<ActivationResponseDto<PatientDto>> CreatePatientByDentist([FromBody] CreatePatientByDentistRequest request)
    {
        var result = _patientService.CreatePatientByDentist(request);
        return CreatedAtAction(nameof(PatientController.GetPatientById), "Patient", new { id = result.Entity.Id }, result);
    }

    [HttpPost("activate-patient")]
    public IActionResult ActivatePatient([FromBody] ActivatePatientRequest dto)
    {
        _patientService.ActivatePatient(dto.Token, dto.Password);
        return NoContent();
    }

    [HttpPost("create-dentist")]
    [Authorize(Roles = "SuperAdmin")]
    public ActionResult<ActivationResponseDto<DentistDto>> CreateDentist([FromBody] CreateDentistRequest dentistDto)
    {
        var result = _dentistService.CreateDentist(dentistDto);
        return CreatedAtAction(nameof(DentistController.GetDentistById), "Dentist", new { id = result.Entity.Id }, result);
    }

    [HttpPost("activate-dentist")]
    public IActionResult ActivateDentist([FromBody] ActivateDentistRequest dto)
    {
        _dentistService.ActivateDentist(dto.Token, dto.Password);
        return NoContent();
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        var token = await _userService.SendPasswordResetEmailAsync(request.Email);
        return Ok(new TokenResponseDto(token));
    }

    [HttpPost("reset-password")]
    public IActionResult ResetPassword([FromBody] ResetPasswordRequest request)
    {
        _userService.ResetPassword(request.Token, request.NewPassword);
        return NoContent();
    }
}
