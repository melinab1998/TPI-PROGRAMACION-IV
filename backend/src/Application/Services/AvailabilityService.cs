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

        public IEnumerable<AvailabilityDto> GetByDentistId(int dentistId)
        {
            var availabilities = _availabilityRepository.GetByDentistId(dentistId);

            if (availabilities == null || !availabilities.Any())
                throw new AppValidationException("NO_AVAILABLE_SLOTS");

            return availabilities.Select(AvailabilityDto.Create);
        }

        public void SetAvailability(int dentistId, IEnumerable<AvailabilityRequest> slots)
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
    }
}

