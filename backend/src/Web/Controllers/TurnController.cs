using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
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
    public ActionResult<IEnumerable<TurnDto>> GetAll()
    {
        return Ok(_turnService.GetAllTurns());
    }

    [HttpGet("{id}")]
    public ActionResult<TurnDto> GetById(int id)
    {
        return Ok(_turnService.GetTurnById(id));
    }

    [HttpPost]
    public ActionResult<TurnDto> Create([FromBody] CreateTurnRequest request)
    {
        var created = _turnService.CreateTurn(request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public ActionResult<TurnDto> Update([FromRoute] int id, [FromBody] UpdateTurnRequest request)
    {
        return Ok(_turnService.UpdateTurn(id, request));
    }

    [HttpPatch("{id}/cancel")]
    public IActionResult Cancel([FromRoute] int id)
    {
        _turnService.CancelTurn(id);
        return NoContent();
    }
}
