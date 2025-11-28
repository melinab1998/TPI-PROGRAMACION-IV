using System.Text.Json;
using Domain.Entities;

namespace Application.Models
{
    public record VisitRecordDto(
        int Id,
        string Treatment,
        string Diagnosis,
        string? Notes,
        string? Prescription,
        int TurnId,
        object? OdontogramData // NUEVO
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
                entity.TurnId,
                string.IsNullOrWhiteSpace(entity.OdontogramData)
                    ? null
                    : JsonSerializer.Deserialize<object>(entity.OdontogramData)
            );
        }

        public static List<VisitRecordDto> CreateList(IEnumerable<VisitRecord> visitRecords)
        {
            return visitRecords.Select(Create).ToList();
        }
    }
}
