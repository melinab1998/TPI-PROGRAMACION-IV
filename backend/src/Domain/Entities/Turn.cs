using Domain.Enums;
using Domain.Exceptions;

namespace Domain.Entities
{
    public class Turn
    {
        public int Id { get; private set; }
        public DateTime AppointmentDate { get; set; }
        public TurnStatus Status { get; set; }
        public string? ConsultationType { get; set; }
        public int PatientId { get; set; }
        public int DentistId { get; set; }
        public Patient? Patient { get; set; }
        public Dentist? Dentist { get; set; }
        public Turn() { }
        public Turn(DateTime appointmentDate, TurnStatus status, string? consultationType, int patientId, int dentistId)
        {
            DateTime appointmentDateUtc = appointmentDate.ToUniversalTime();
            DateTime nowUtc = DateTime.UtcNow;

            if (appointmentDateUtc < nowUtc)
                throw new AppValidationException("CANNOT_CREATE_PAST_TURN");

            AppointmentDate = appointmentDate;
            Status = status;
            ConsultationType = consultationType;
            PatientId = patientId;
            DentistId = dentistId;
        }

        public void Cancel()
        {
            if (Status == TurnStatus.Cancelled)
                throw new AppValidationException("TURN_ALREADY_CANCELLED");

            DateTime appointmentDateUtc = AppointmentDate.ToUniversalTime();
            DateTime nowUtc = DateTime.UtcNow;

            if (appointmentDateUtc < nowUtc)
                throw new AppValidationException("CANNOT_CANCEL_PAST_TURN");

            Status = TurnStatus.Cancelled;
        }

        public void UpdateStatus(TurnStatus newStatus)
        {
            if (Status == TurnStatus.Cancelled && newStatus != TurnStatus.Cancelled)
                throw new AppValidationException("CANNOT_CHANGE_STATUS_FROM_CANCELLED");

            Status = newStatus;
        }

        public void Reschedule(DateTime newDate, IEnumerable<Availability> availabilities, IEnumerable<Turn> existingTurns)
        {
            DateTime newDateUtc = newDate.ToUniversalTime();
            DateTime nowUtc = DateTime.UtcNow;

            if (newDateUtc < nowUtc)
                throw new AppValidationException("CANNOT_RESCHEDULE_PAST_TURN");

            var start = newDate.TimeOfDay;

            if (start.Minutes % 30 != 0 || start.Seconds != 0 || start.Milliseconds != 0)
                throw new AppValidationException("INVALID_TIME_SLOT");

            bool fits = availabilities.Any(a => start >= a.StartTime && start < a.EndTime);
            if (!fits)
                throw new AppValidationException("OUT_OF_AVAILABLE_HOURS");

            if (existingTurns.Any(t => t.AppointmentDate == newDate))
                throw new AppValidationException("TIME_SLOT_TAKEN");

            AppointmentDate = newDate;
        }
    }
}