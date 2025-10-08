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
        public Turn(DateTime appointmentDate, TurnStatus status, string? consultationType, int patientId, int dentistId)
        {
            AppointmentDate = appointmentDate;
            Status = status;
            ConsultationType = consultationType;
            PatientId = patientId;
            DentistId = dentistId;
        }
    }
}
