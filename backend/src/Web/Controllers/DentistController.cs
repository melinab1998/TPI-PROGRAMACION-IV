using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;

[Route("api/dentists")]
[ApiController]
public class DentistController : ControllerBase
{
    private readonly IDentistService _dentistService;

    public DentistController(IDentistService dentistService)
    {
        _dentistService = dentistService;
    }

    [HttpGet]
    [Authorize(Roles = "SuperAdmin, Patient, Dentist")] 
    public ActionResult<IEnumerable<DentistDto>> GetAllDentists()
    {
        return Ok(_dentistService.GetAllDentists());
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "SuperAdmin, Patient, Dentist")]
    public ActionResult<DentistDto> GetDentistById([FromRoute] int id)
    {
        return Ok(_dentistService.GetDentistById(id));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "SuperAdmin")]
    public ActionResult<DentistDto> UpdateDentist([FromRoute] int id, [FromBody] UpdateDentistRequest request)
    {
        return Ok(_dentistService.UpdateDentist(id, request));
    }



    [HttpPatch("{id}/activate")]
    [Authorize(Roles = "SuperAdmin")]
    public ActionResult<DentistDto> ActivateDentistByAdmin([FromRoute] int id, [FromBody] AdminActivateDentistRequest request)
    {
        return Ok(_dentistService.SetActiveStatusByAdmin(id, request.IsActive!.Value));
    }
}
