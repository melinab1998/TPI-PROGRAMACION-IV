using System.Security.Claims;
using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/turns")]
[ApiController]
public class TurnController : ControllerBase
{
    private readonly ITurnService _turnService;

    public TurnController(ITurnService turnService)
    {
        _turnService = turnService;
    }

    [HttpGet]
    [Authorize(Roles = "SuperAdmin, Dentist, Patient")]
    public ActionResult<IEnumerable<TurnDto>> GetAll()
    {
        return Ok(_turnService.GetAllTurns());
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "SuperAdmin, Dentist, Patient")]

    public ActionResult<TurnDto> GetById(int id)
    {
        return Ok(_turnService.GetTurnById(id));
    }

    [HttpPost]
    [Authorize(Roles = "Dentist, Patient")]
    public ActionResult<TurnDto> Create([FromBody] CreateTurnRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value!;
        
        var created = _turnService.CreateTurn(request, userId, userRole);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "SuperAdmin, Dentist")]
    public ActionResult<TurnDto> Update([FromRoute] int id, [FromBody] UpdateTurnRequest request)
    {
        return Ok(_turnService.UpdateTurn(id, request));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "SuperAdmin, Dentist")]
    public IActionResult DeleteTurn([FromRoute] int id)
    {
        _turnService.DeleteTurn(id);
        return NoContent();
    }


    [HttpPatch("{id}/cancel")]
    [Authorize(Roles = "SuperAdmin, Dentist, Patient")]
    public IActionResult Cancel([FromRoute] int id)
    {
        _turnService.CancelTurn(id);
        return NoContent();
    }
}
