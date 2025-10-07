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

            ValidateTimes(startTime, endTime);
            ValidateIds(dentistId);

            DayOfWeek = dayOfWeek;
            StartTime = startTime;
            EndTime = endTime;
            DentistId = dentistId;
        }


        private static void ValidateTimes(TimeOnly start, TimeOnly end)
        {
            if (end <= start)
                throw new ArgumentException("La hora de fin debe ser posterior a la hora de inicio.");
        }

        private static void ValidateIds(int dentistId)
        {
            if (dentistId <= 0)
                throw new ArgumentException("El Id del dentista no es válido.");
        }

         public bool IsWithinRange(TimeOnly appointmentTime)
        {
            return appointmentTime >= StartTime && appointmentTime <= EndTime;
        }

    }
}
