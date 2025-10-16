using Microsoft.AspNetCore.Mvc;
using Application.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Application.Services;
using Web.Models.Requests;
using Web.Models;
using Web.Models.Responses;
using Domain.Entities;

[Route("api/authentication")]
[ApiController]
public class AuthenticationController : ControllerBase
{
    private readonly UserService _userService;
    private readonly DentistService _dentistService;

    private readonly PatientService _patientService;

    public AuthenticationController(UserService authService, DentistService dentistService, PatientService patientService)
    {
        _userService = authService;
        _dentistService = dentistService;
        _patientService = patientService;
    }

    [HttpPost("login")]
    public ActionResult<AuthenticationResponseDto> Login([FromBody] AuthenticationRequest dto)
    {
        var user = _userService.Authenticate(dto.Email, dto.Password);

        return Ok(new AuthenticationResponseDto(user.Token, user.GetType().Name));
    }

    [HttpPost("register-patient")]
    public ActionResult<PatientDto> RegisterPatient([FromBody] RegisterPatientRequest patientDto)
    {
        var newPatient = _patientService.RegisterPatient(
            patientDto.FirstName,
            patientDto.LastName,
            patientDto.Email,
            patientDto.Password,
            patientDto.Dni
        );

        return CreatedAtAction(nameof(GetPatientById), new { id = newPatient.Id }, PatientDto.RegisterPatient(newPatient));
    }


    [HttpGet("patient/{id}", Name = "GetPatientById")]
    public ActionResult<PatientDto> GetPatientById([FromRoute] int id)
    {
        var patient = _patientService.GetPatientById(id);

        var dto = PatientDto.RegisterPatient(patient);

        return Ok(dto);

    }

    [HttpPost("create-dentist")]
    [Authorize(Roles = "SuperAdmin")]
    public ActionResult<DentistDto> CreateDentist([FromBody] CreateDentistRequest dentistDto)
    {
        var newDentist = _dentistService.CreateDentist(
            dentistDto.FirstName,
            dentistDto.LastName,
            dentistDto.Email,
            dentistDto.LicenseNumber
            );

        return CreatedAtAction(nameof(GetDentistById), new { id = newDentist.Id }, DentistDto.Create(newDentist));
    }

    [HttpPost("activate-dentist")]
    public ActionResult ActivateDentist([FromBody] ActivateDentistRequest dto)
    {
        _dentistService.ActivateDentist(dto.Token, dto.Password);

        return NoContent();
    }

    [HttpGet("dentist/{id}", Name = "GetDentistById")]
    public ActionResult<DentistDto> GetDentistById([FromRoute] int id)
    {
        var dentist = _dentistService.GetDentistById(id);

        var dto = DentistDto.Create(dentist);

        return Ok(dto);

    }



}
