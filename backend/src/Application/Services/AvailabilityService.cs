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

        public AvailabilityService(
            IAvailabilityRepository availabilityRepository,
            ITurnRepository turnRepository) 
        {
            _availabilityRepository = availabilityRepository;
            _turnRepository = turnRepository;
        }

        // Obtener la disponibilidad de un dentista en específico
        public IEnumerable<AvailabilityDto> GetByDentistId(int dentistId)
        {
            var availabilities = _availabilityRepository.GetByDentistId(dentistId);

            if (availabilities == null || !availabilities.Any())
                throw new NotFoundException("NO_AVAILABLE_SLOTS");

            return availabilities.Select(AvailabilityDto.Create);
        }

        // Creación de la disponibilidad
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
                existingSlots.Add(newSlot); // para validar los siguientes slots
            }
        }

        // Actualización de la disponibilidad
        public void UpdateAvailability(int slotId, AvailabilityRequest updatedSlot)
        {
            var slot = _availabilityRepository.GetById(slotId);
            if (slot == null)
                throw new NotFoundException("SLOT_NOT_FOUND");

            slot.DayOfWeek = updatedSlot.DayOfWeek;
            slot.StartTime = TimeSpan.Parse(updatedSlot.StartTime);
            slot.EndTime = TimeSpan.Parse(updatedSlot.EndTime);

            var otherSlots = _availabilityRepository.GetByDentistId(slot.DentistId)
                .Where(s => s.Id != slotId && s.DayOfWeek == slot.DayOfWeek);

            bool overlaps = otherSlots.Any(s => !(slot.EndTime <= s.StartTime || slot.StartTime >= s.EndTime));
            if (overlaps)
                throw new AppValidationException("TIME_SLOT_OVERLAP");

            _availabilityRepository.Update(slot);
        }

        // 🔹 Nuevo: Obtener los horarios disponibles (no ocupados)
        public Dictionary<string, List<string>> GetAvailableSlots(int dentistId, DateTime startDate, DateTime endDate)
        {
            if (startDate > endDate)
                throw new AppValidationException("INVALID_DATE_RANGE");

            // 1️⃣ Obtener disponibilidad semanal
            var availabilities = _availabilityRepository.GetByDentistId(dentistId).ToList();
            if (!availabilities.Any())
                throw new NotFoundException("NO_AVAILABILITY_DEFINED");

            // 2️⃣ Obtener turnos ya reservados (desde TurnRepository)
            var bookedTurns = _turnRepository.GetBookedTurnsInRange(dentistId, startDate, endDate).ToList();

            // 3️⃣ Resultado final
            var result = new Dictionary<string, List<string>>();

            // 4️⃣ Iterar los días del rango
            for (var date = startDate.Date; date <= endDate.Date; date = date.AddDays(1))
            {
                var weekday = date.DayOfWeek;
                var dayAvailability = availabilities.Where(a => a.DayOfWeek == weekday).ToList();

                if (!dayAvailability.Any())
                    continue; // ese día no trabaja

                var availableHours = new List<string>();

                foreach (var slot in dayAvailability)
                {
                    var current = slot.StartTime;
                    while (current < slot.EndTime)
                    {
                        var next = current.Add(TimeSpan.FromMinutes(30)); // intervalos de 30 minutos

                        bool isBooked = bookedTurns.Any(t =>
                            t.AppointmentDate.Date == date &&
                            t.AppointmentDate.TimeOfDay >= current &&
                            t.AppointmentDate.TimeOfDay < next);

                        if (!isBooked)
                            availableHours.Add(current.ToString(@"hh\:mm"));

                        current = next;
                    }
                }

                if (availableHours.Any())
                    result[date.ToString("yyyy-MM-dd")] = availableHours;
            }

            return result;
        }
    }
}
