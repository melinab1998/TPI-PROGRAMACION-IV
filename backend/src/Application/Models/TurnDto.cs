using Domain.Entities;
using Domain.Enums;

namespace Application.Models
{
    public class TurnDto
    {
        public int Id { get; set; }
        public DateTime AppointmentDate { get; set; }
        public TurnStatus Status { get; set; }
        public string? ConsultationType { get; set; }
        public int PatientId { get; set; }
        public int DentistId { get; set; }
        public string? DentistFullName { get; set; }

        public static TurnDto Create(Turn t) => new()
        {
            Id = t.Id,
            AppointmentDate = t.AppointmentDate,
            Status = t.Status,
            ConsultationType = t.ConsultationType,
            PatientId = t.PatientId,
            DentistId = t.DentistId,
            DentistFullName = t.Dentist != null
                ? $"{t.Dentist.FirstName} {t.Dentist.LastName}"
                : null
        };

        public static List<TurnDto> CreateList(IEnumerable<Turn> turns)
        {
            return turns.Select(turn => Create(turn)).ToList();
        }
    
    }

}
