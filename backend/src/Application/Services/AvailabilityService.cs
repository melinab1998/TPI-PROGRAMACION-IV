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

        public AvailabilityService(IAvailabilityRepository availabilityRepository)
        {
            _availabilityRepository = availabilityRepository;
        }

        //Obtener la disponibilidad un dentista en especifico
        public IEnumerable<AvailabilityDto> GetByDentistId(int dentistId)
        {
            var availabilities = _availabilityRepository.GetByDentistId(dentistId);

            if (availabilities == null || !availabilities.Any())
                throw new NotFoundException("NO_AVAILABLE_SLOTS");

            return availabilities.Select(AvailabilityDto.Create);
        }

        //Creacion de la disponibilidad
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

        //Actualizacion de la disponibilidad
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
    }
}

