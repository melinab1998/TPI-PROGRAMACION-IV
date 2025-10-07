using Domain.Enums;

namespace Domain.Entities
{
    public class Turn
    {
        public int Id { get; private set; }
        public DateTime AppointmentDate { get; private set; }
        public TurnStatus Status { get; private set; }
        public string? ConsultationType { get; private set; }

        // Foreign Keys
        public int PatientId { get; private set; }
        public int DentistId { get; private set; }

        // Propiedades de navegación
        public Patient? Patient { get; private set; }
        public Dentist? Dentist { get; private set; }



        public Turn() { }

        public Turn(DateTime appointmentDate, TurnStatus status, string consultationType, int patientId, int dentistId)
        {
            ValidateAppointmentDate(appointmentDate);
            AppointmentDate = appointmentDate;
            Status = TurnStatus.Pending;
            ConsultationType = consultationType;
            PatientId = patientId;
            DentistId = dentistId;
        }

        private void ValidateAppointmentDate(DateTime date)
        {
            if (date < DateTime.Now)
                throw new ArgumentException("No puedes sacar un turno en el pasado.");
        }
        
        public void MarkAsCompleted()
        {
            if (Status != TurnStatus.Pending)
                throw new InvalidOperationException("Solo los turnos pendientes pueden completarse.");

            Status = TurnStatus.Completed;
        }

        public void MarkAsCancelled()
        {
            if (Status != TurnStatus.Pending)
                throw new InvalidOperationException("Solo los turnos pendientes pueden cancelarse.");

            Status = TurnStatus.Cancelled;
        }

    }
}
