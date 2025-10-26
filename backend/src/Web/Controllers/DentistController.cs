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
    public ActionResult<IEnumerable<DentistDto>> GetAllDentists()
    {
        return Ok(_dentistService.GetAllDentists());
    }

    [HttpGet("{id}")]
    public ActionResult<DentistDto> GetDentistById([FromRoute] int id)
    {
        return Ok(_dentistService.GetDentistById(id));
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin")]
    public ActionResult<DentistDto> CreateDentist([FromBody] CreateDentistRequest request)
    {
        var created = _dentistService.CreateDentist(request);
        return CreatedAtAction(nameof(GetDentistById), new { id = created.Id }, created);
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
