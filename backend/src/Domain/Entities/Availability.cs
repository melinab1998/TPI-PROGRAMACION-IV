using System.ComponentModel.DataAnnotations.Schema;


namespace Domain.Entities
{
    public class Availability
    {
        public int Id { get; set; }
        public DayOfWeek DayOfWeek { get; set; }

        
        [Column(TypeName = "time(0)")]
        public TimeSpan StartTime { get; set; }
        [Column(TypeName = "time(0)")]
        public TimeSpan EndTime { get; set; }

        // Foreign Key
        public int DentistId { get; set; }

        // Propiedad de navegación
        public Dentist? Dentist { get; set; }

        public Availability() { }

        public Availability(DayOfWeek dayOfWeek, TimeSpan startTime, TimeSpan endTime, int dentistId)
        {
            DayOfWeek = dayOfWeek;
            StartTime = startTime;
            EndTime = endTime;
            DentistId = dentistId;
        }
    }
}

