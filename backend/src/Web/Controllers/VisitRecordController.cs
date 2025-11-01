using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Microsoft.AspNetCore.Mvc;

[Route("api/visitRecords")]
[ApiController]
public class VisitRecordController : ControllerBase
{
    private readonly IVisitRecordService _visitRecordService;

    public VisitRecordController(IVisitRecordService visitRecordService)
    {
        _visitRecordService = visitRecordService;
    }

    [HttpGet]
    public ActionResult<List<VisitRecordDto>> GetAll()
    {
        return Ok(_visitRecordService.GetAllVisitRecord());
    }

    [HttpGet("{id}")]
    public ActionResult<VisitRecordDto> GetById(int id)
    {
        return Ok(_visitRecordService.GetVisitRecordById(id));
    }

    [HttpPost]
    public ActionResult<VisitRecordDto> Create([FromBody] CreateVisitRecordRequest request)
    {
        var created = _visitRecordService.CreateVisitRecord(request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public ActionResult<VisitRecordDto> Update([FromRoute] int id, [FromBody] UpdateVisitRecordRequest request)
    {
        return Ok(_visitRecordService.UpdateVisitRecord(id, request));
    }
}
