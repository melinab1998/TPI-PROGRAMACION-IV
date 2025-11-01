using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Application.Services
{
    public class AvailabilityService : IAvailabilityService
    {
        private readonly IAvailabilityRepository _availabilityRepository;
        private readonly ITurnRepository _turnRepository;

        public AvailabilityService(IAvailabilityRepository availabilityRepository, ITurnRepository turnRepository)
        {
            _availabilityRepository = availabilityRepository;
            _turnRepository = turnRepository;
        }

        public IEnumerable<AvailabilityDto> GetByDentistId(int dentistId)
        {
            var availabilities = _availabilityRepository.GetByDentistId(dentistId);

            if (availabilities == null || !availabilities.Any())
                throw new NotFoundException("NO_AVAILABLE_SLOTS");

            return availabilities.Select(AvailabilityDto.Create);
        }

        public void CreateAvailability(int dentistId, IEnumerable<AvailabilityRequest> slots)
        {
            if (slots == null || !slots.Any())
                throw new AppValidationException("MANDATORY_FIELDS");

            var existingSlots = _availabilityRepository.GetByDentistId(dentistId).ToList();

            foreach (var slotRequest in slots)
            {
                var newSlot = new Availability(
                    slotRequest.DayOfWeek,
                    TimeSpan.Parse(slotRequest.StartTime),
                    TimeSpan.Parse(slotRequest.EndTime),
                    dentistId
                );

                // Validar superposición con tramos existentes del mismo día
                bool overlaps = existingSlots
                    .Where(s => s.DayOfWeek == newSlot.DayOfWeek)
                    .Any(s => !(newSlot.EndTime <= s.StartTime || newSlot.StartTime >= s.EndTime));

                if (overlaps)
                    throw new AppValidationException("TIME_SLOT_OVERLAP");

                _availabilityRepository.Add(newSlot);
                existingSlots.Add(newSlot); // para validar siguientes slots
            }
        }
        public void UpdateAvailability(int slotId, AvailabilityRequest updatedSlot)
        {
            // Traer el slot existente
            var slot = _availabilityRepository.GetById(slotId);
            if (slot == null)
                throw new NotFoundException("SLOT_NOT_FOUND");

            // Actualizar valores
            slot.DayOfWeek = updatedSlot.DayOfWeek;
            slot.StartTime = TimeSpan.Parse(updatedSlot.StartTime);
            slot.EndTime = TimeSpan.Parse(updatedSlot.EndTime);

            // Validar superposición con otros slots del mismo dentista
            var otherSlots = _availabilityRepository.GetByDentistId(slot.DentistId)
                            .Where(s => s.Id != slotId && s.DayOfWeek == slot.DayOfWeek);

            bool overlaps = otherSlots.Any(s => !(slot.EndTime <= s.StartTime || slot.StartTime >= s.EndTime));
            if (overlaps)
                throw new AppValidationException("TIME_SLOT_OVERLAP");

            _availabilityRepository.Update(slot);
        }

        public IEnumerable<string> GetAvailableSlots(int dentistId, DateTime date)
        {
            var dayOfWeek = date.DayOfWeek;
            var availabilities = _availabilityRepository.GetByDentistAndDay(dentistId, dayOfWeek);
            if (!availabilities.Any())
                throw new NotFoundException("NO_AVAILABILITY_FOR_DAY");

            // Obtener turnos ya reservados
            var bookedTurns = _turnRepository.GetBookedTurns(dentistId, date);

            var availableSlots = new List<string>();

            foreach (var slot in availabilities)
            {
                var start = slot.StartTime;
                while (start < slot.EndTime)
                {
                    // Turnos de 30 minutos
                    var end = start.Add(TimeSpan.FromMinutes(30));

                    // Verificar si ya hay un turno reservado a esa hora
                    bool isBooked = bookedTurns.Any(t =>
                        t.AppointmentDate.TimeOfDay == start);

                    if (!isBooked)
                        availableSlots.Add(start.ToString(@"hh\:mm"));

                    start = end;
                }
            }

            return availableSlots;
        }

    }
}

