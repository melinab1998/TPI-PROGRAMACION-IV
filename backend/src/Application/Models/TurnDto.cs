using Domain.Entities;
using Domain.Enums;

namespace Application.Models
{
    public record TurnDto(
        int Id,
        DateTime AppointmentDate,
        TurnStatus Status,
        string? ConsultationType,
        int PatientId,
        int DentistId,
        DentistDto? Dentist
    )
    {
        public static TurnDto Create(Turn t)
        {
            return new TurnDto(
                t.Id,
                t.AppointmentDate,
                t.Status,
                t.ConsultationType,
                t.PatientId,
                t.DentistId,
                t.Dentist != null ? DentistDto.Create(t.Dentist) : null
            );
        }

        public static List<TurnDto> CreateList(IEnumerable<Turn> turns)
        {
            return turns.Select(Create).ToList();
        }
    }
}
