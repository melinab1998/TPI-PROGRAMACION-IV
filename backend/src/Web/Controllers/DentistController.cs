using Microsoft.AspNetCore.Mvc;
using Application.Interfaces;
using Web.Models;
using Domain.Entities;

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
        var dentists = _dentistService.GetAllDentists();
        var dtoList = dentists.Select(DentistDto.Create).ToList();
        return Ok(dtoList);
    }

    [HttpGet("{id}")]
    public ActionResult<DentistDto> GetDentistById([FromRoute] int id)
    {
        var dentist = _dentistService.GetDentistById(id);
        var dto = DentistDto.Create(dentist);
        return Ok(dto);
    }
}