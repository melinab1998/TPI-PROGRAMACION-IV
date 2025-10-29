using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;

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

        public IEnumerable<TurnDto> GetAllTurns()
        {
            var turns = _turnRepository.List();
            if (!turns.Any())
                throw new NotFoundException("NO_TURNS_FOUND");

            return turns.Select(TurnDto.Create);
        }

        public TurnDto GetTurnById(int id)
        {
            var turn = _turnRepository.GetById(id)
                ?? throw new NotFoundException("TURN_NOT_FOUND");

            return TurnDto.Create(turn);
        }

        public TurnDto CreateTurn(CreateTurnRequest request)
        {
            // Validar paciente
            var patient = _patientRepository.GetById(request.PatientId);
            if (patient == null)
                throw new NotFoundException("PATIENT_NOT_FOUND");

            // Validar dentista
            var dentist = _dentistRepository.GetById(request.DentistId);
            if (dentist == null)
                throw new NotFoundException("DENTIST_NOT_FOUND");

            // Validar disponibilidad del dentista
            var availabilities = _availabilityRepository.GetByDentistAndDay(request.DentistId, request.AppointmentDate.DayOfWeek);
            if (!availabilities.Any())
                throw new AppValidationException("NO_AVAILABILITY_FOR_DAY");
            
            // Validar que el paciente no tenga otro turno ese día
            var patientTurnsSameDay = _turnRepository.GetTurnsByPatient(request.PatientId)
                .Where(t => t.AppointmentDate.Date == request.AppointmentDate.Date);

            if (patientTurnsSameDay.Any())
                throw new AppValidationException("PATIENT_ALREADY_HAS_TURN_TODAY");

            // Validar que no haya otro turno en esa hora
            var existingTurns = _turnRepository.GetTurnsByDentist(request.DentistId);
           
            // Crear turno
            var turn = new Turn(
                request.AppointmentDate,
                request.Status,
                request.ConsultationType.ToString(),
                request.PatientId,
                request.DentistId
            );

            turn.Reschedule(request.AppointmentDate, availabilities, existingTurns);

            _turnRepository.Add(turn);
            return TurnDto.Create(turn);
        }

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

        public void CancelTurn(int id)
        {
            var turn = _turnRepository.GetById(id)
                ?? throw new NotFoundException("TURN_NOT_FOUND");

            turn.Cancel();
            _turnRepository.Update(turn);
        }
    }
}

