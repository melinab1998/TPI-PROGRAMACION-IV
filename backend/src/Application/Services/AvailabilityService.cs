using Application.Interfaces;
using Application.Models;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;

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
                throw new AppValidationException("No se encontraron horarios disponibles para este dentista.");

            return availabilities.Select(AvailabilityDto.Create);
        }

        public void SetAvailability(int dentistId, IEnumerable<AvailabilityDto> slots)
        {
            if (slots == null || !slots.Any())
                throw new AppValidationException("Debe proporcionar al menos un horario.");

            var existingSlots = _availabilityRepository.GetByDentistId(dentistId).ToList();

            foreach (var slotDto in slots)
            {
                var newSlot = new Availability(
                    slotDto.DayOfWeek,
                    TimeSpan.Parse(slotDto.StartTime),
                    TimeSpan.Parse(slotDto.EndTime),
                    dentistId
                );

                var existing = existingSlots.FirstOrDefault(s =>
                    s.DayOfWeek == newSlot.DayOfWeek
                );

                if (existing != null)
                {
                    existing.StartTime = newSlot.StartTime;
                    existing.EndTime = newSlot.EndTime;
                    _availabilityRepository.Update(existing);
                }
                else
                {
                    _availabilityRepository.Add(newSlot);
                }
            }
        }
    }
}

