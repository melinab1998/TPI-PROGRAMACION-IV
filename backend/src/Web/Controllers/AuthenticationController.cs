using Microsoft.AspNetCore.Mvc;
using Application.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Application.Interfaces;
using Web.Models.Requests;
using Web.Models;
using Web.Models.Responses;
using Domain.Entities;

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

    // -------------------- LOGIN --------------------
    [HttpPost("login")]
    public ActionResult<AuthenticationResponseDto> Login([FromBody] AuthenticationRequest dto)
    {
        var user = _userService.Authenticate(dto.Email, dto.Password);
        return Ok(new AuthenticationResponseDto(user.Token, user.GetType().Name));
    }

    // -------------------- PACIENTES --------------------

    // Registro directo (público)
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

        return CreatedAtAction(
            nameof(PatientController.GetPatientById),
            "Patient",
            new { id = newPatient.Id },
            PatientDto.RegisterPatient(newPatient)
        );
    }

    // Creación por parte del dentista o admin
    [HttpPost("create-patient")]
    [Authorize(Roles = "Dentist, SuperAdmin")]
    public ActionResult<PatientDtoFull> CreatePatientByDentist([FromBody] CreatePatientByDentistRequest request)
    {
        var newPatient = _patientService.CreatePatientByDentist(
            request.FirstName,
            request.LastName,
            request.Email,
            request.Dni,
            request.Address,
            request.PhoneNumber,
            request.City,
            request.MembershipNumber,
            request.BirthDate,
            request.HealthPlanId 
        );

        var dto = PatientDtoFull.Create(newPatient);

        return CreatedAtAction(
            nameof(PatientController.GetPatientById),
            "Patient",
            new { id = newPatient.Id },
            dto
        );
    }

    // Activación del paciente creado por un dentista
    [HttpPost("activate-patient")]
    public IActionResult ActivatePatient([FromBody] ActivatePatientRequest dto)
    {
        _patientService.ActivatePatient(dto.Token, dto.Password);
        return NoContent();
    }

    // -------------------- DENTISTAS --------------------

    // Creación por parte del superadmin
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

        return CreatedAtAction(
            nameof(DentistController.GetDentistById),
            "Dentist",
            new { id = newDentist.Id },
            DentistDto.Create(newDentist)
        );
    }

    [HttpPost("activate-dentist")]
    public ActionResult ActivateDentist([FromBody] ActivateDentistRequest dto)
    {
        _dentistService.ActivateDentist(dto.Token, dto.Password);
        return NoContent();
    }
}
