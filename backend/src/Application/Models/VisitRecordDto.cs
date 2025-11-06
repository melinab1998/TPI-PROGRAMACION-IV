using Domain.Entities;

namespace Application.Models
{
    public record VisitRecordDto(
        int Id,
        string Treatment,
        string Diagnosis,
        string? Notes,
        string? Prescription,
        int TurnId
    )
    {
        public static VisitRecordDto Create(VisitRecord entity)
        {
            return new VisitRecordDto(
                entity.Id,
                entity.Treatment,
                entity.Diagnosis,
                entity.Notes,
                entity.Prescription,
                entity.TurnId
            );
        }

        public static List<VisitRecordDto> CreateList(IEnumerable<VisitRecord> visitRecords)
        {
            return visitRecords.Select(Create).ToList();
        }
    }
}
