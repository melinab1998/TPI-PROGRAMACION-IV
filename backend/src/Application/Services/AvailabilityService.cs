using Application.Interfaces;
using Application.Models;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;
using Application.Models.Requests;

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

                var existing = existingSlots.FirstOrDefault(s => s.DayOfWeek == newSlot.DayOfWeek);

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
