using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Enums;


namespace Application.Services
{
    public class TurnService : ITurnService
    {
        private readonly ITurnRepository _turnRepository;
        private readonly IAvailabilityRepository _availabilityRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly IDentistRepository _dentistRepository;

        public TurnService(
            ITurnRepository turnRepository,
            IAvailabilityRepository availabilityRepository,
            IPatientRepository patientRepository,
            IDentistRepository dentistRepository)
        {
            _turnRepository = turnRepository;
            _availabilityRepository = availabilityRepository;
            _patientRepository = patientRepository;
            _dentistRepository = dentistRepository;
        }

        // Obtiene todos los turnos registrados en el sistema.
        public List<TurnDto> GetAllTurns()
        {
            var turns = _turnRepository.List();
            if (!turns.Any())
                return new List<TurnDto>();

            return TurnDto.CreateList(turns);
        }

        // Obtiene un turno específico a partir de su identificador.
        public TurnDto GetTurnById(int id)
        {
            var turn = _turnRepository.GetById(id)
                ?? throw new NotFoundException("TURN_NOT_FOUND");

            return TurnDto.Create(turn);
        }

        // Crea un nuevo turno (cita) para un paciente con un dentista.
        public TurnDto CreateTurn(CreateTurnRequest request, string userId, string userRole)
        {

            // Validar que el userId no sea nulo o vacío antes de convertir
            if (string.IsNullOrWhiteSpace(userId))
                throw new AppValidationException("USER_NOT_AUTHENTICATED");

            if (!int.TryParse(userId, out int parsedUserId))
                throw new AppValidationException("INVALID_USER_ID");

            // Si es paciente, no puede crear turno para otro paciente
            int patientId = userRole == "Patient" ? parsedUserId : request.PatientId;
            if (userRole == "Patient" && request.PatientId != parsedUserId)
                throw new AppValidationException("PATIENT_ID_MISMATCH");


            // Validar que el turno esté en intervalos de 30 minutos
            if (request.AppointmentDate.Minute % 30 != 0 || request.AppointmentDate.Second != 0)
                throw new AppValidationException("APPOINTMENT_MUST_BE_ON_HALF_HOUR");

            // Validar paciente
            var patient = _patientRepository.GetById(request.PatientId);
            if (patient == null)
                throw new NotFoundException("PATIENT_NOT_FOUND");

            // Validar dentista
            var dentist = _dentistRepository.GetById(request.DentistId);
            if (dentist == null)
                throw new NotFoundException("DENTIST_NOT_FOUND");

            if (!dentist.IsActive)
                throw new AppValidationException("DENTIST_NOT_AVAILABLE");

            // Validar que la fecha no sea un día pasado
            if (request.AppointmentDate.Date < DateTime.Now.Date)
                throw new AppValidationException("INVALID_APPOINTMENT_DATE");

            // Validar disponibilidad del dentista para el día solicitado
            var availabilities = _availabilityRepository
                .GetByDentistAndDay(request.DentistId, request.AppointmentDate.DayOfWeek);
            if (!availabilities.Any())
                throw new AppValidationException("NO_AVAILABILITY_FOR_DAY");

            // Validar que el paciente no tenga otro turno pendiente ese día
            var patientPendingTurnsSameDay = _turnRepository.GetTurnsByPatient(request.PatientId)
                .Where(t => t.AppointmentDate.Date == request.AppointmentDate.Date &&
                            t.Status == TurnStatus.Pending);

            if (patientPendingTurnsSameDay.Any())
                throw new AppValidationException("PATIENT_ALREADY_HAS_TURN_TODAY");

            // Validar que no haya otro turno pendiente para el dentista a esa hora
            var dentistPendingTurns = _turnRepository.GetTurnsByDentist(request.DentistId)
                .Where(t => t.Status == TurnStatus.Pending);

            // Crear el turno
            var turn = new Turn(
                request.AppointmentDate,
                request.Status,
                request.ConsultationType.ToString(),
                request.PatientId,
                request.DentistId
            );

            // Verificar que el horario encaje con la disponibilidad
            turn.Reschedule(request.AppointmentDate, availabilities, dentistPendingTurns);

            _turnRepository.Add(turn);

            return TurnDto.Create(turn);
        }


        // Actualiza la información de un turno existente.
        public TurnDto UpdateTurn(int id, UpdateTurnRequest request)
        {
            var turn = _turnRepository.GetById(id)
                ?? throw new NotFoundException("TURN_NOT_FOUND");

            if (request.AppointmentDate != null)
            {
                var availabilities = _availabilityRepository.GetByDentistAndDay(turn.DentistId, request.AppointmentDate.Value.DayOfWeek);
                if (!availabilities.Any())
                    throw new AppValidationException("NO_AVAILABILITY_FOR_DAY");


                var existingTurns = _turnRepository.GetTurnsByDentist(turn.DentistId)
                    .Where(t => t.Id != id);


                turn.Reschedule(request.AppointmentDate.Value, availabilities, existingTurns);
            }

            if (request.Status != null)
                turn.Status = request.Status.Value;

            if (!string.IsNullOrEmpty(request.ConsultationType))
                turn.ConsultationType = request.ConsultationType;

            _turnRepository.Update(turn);
            return TurnDto.Create(turn);
        }

        // Elimina un turno del sistema.
        public void DeleteTurn(int id)
        {
            var turn = _turnRepository.GetById(id)
                ?? throw new NotFoundException("TURN_NOT_FOUND");

            _turnRepository.Delete(turn);
        }

        // Cancela un turno activo y actualiza su estado.
        public void CancelTurn(int id)
        {
            var turn = _turnRepository.GetById(id)
                ?? throw new NotFoundException("TURN_NOT_FOUND");

            turn.Cancel();
            _turnRepository.Update(turn);
        }
    }
}

