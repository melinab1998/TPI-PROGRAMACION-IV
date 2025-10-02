using Domain.Enums;


namespace Domain.Entities
{
    public class Availability
    {
        public int Id { get; set; }

        public WorkDay DayOfWeek { get; set; }

        public TimeOnly StartTime { get; set; }

        public TimeOnly EndTime { get; set; }

        //Foreign key
        public int DentistId { get; set; }

        //Propiedad de navegación
        public Dentist? Dentist { get; set; }


        public Availability() { }

       public Availability(WorkDay dayOfWeek, TimeOnly startTime, TimeOnly endTime, int dentistId)
        {
            DayOfWeek = dayOfWeek;
            StartTime = startTime;
            EndTime = endTime;
            DentistId = dentistId;
        }

    }
}
