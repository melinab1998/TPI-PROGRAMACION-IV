using Domain.Entities;

namespace Application.Models;

public record VisitRecordDto(int Id, DateOnly VisitDate, string Treatment, string Diagnosis, string? Notes, string? Prescription, int TurnId)
{
    public static VisitRecordDto Create(VisitRecord entity)
    {
        var dto = new VisitRecordDto(entity.Id, entity.VisitDate, entity.Treatment, entity.Diagnosis, entity.Notes, entity.Prescription, entity.TurnId);

        return dto;
    }
    public static List<VisitRecordDto> CreateList(IEnumerable<VisitRecord> visitRecords)
    {
        return visitRecords.Select(visitRecord => Create(visitRecord)).ToList();
    }

}