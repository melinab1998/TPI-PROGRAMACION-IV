using Domain.Enums;

namespace Domain.Entities
{
    public class Turn
    {
        public int Id { get; set; }
        public DateTime AppointmentDate { get; set; }
        public TurnStatus Status { get; set; }
        public string ConsultationType { get; set; }

        //Foreign Keys
        public int PatientId { get; set; }
        public int DentistId { get; set; }

        //Propiedades de navegación
        public Patient? Patient { get; set; }
        public Dentist? Dentist { get; set; }



        public Turn()
        {
            AppointmentDate = DateTime.Now;
            Status = TurnStatus.Pending;
        }
        
        public Turn(DateTime appointmentDate, TurnStatus status, string consultationType, int patientId, int dentistId)
        {
            AppointmentDate = appointmentDate;
            Status = status;
            ConsultationType = consultationType;
            PatientId = patientId;
            DentistId = dentistId;
        }

    }
}
