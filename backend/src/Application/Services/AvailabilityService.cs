using Application.Interfaces;
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

        public IEnumerable<Availability> GetByDentistId(int dentistId)
        {
            var availabilities = _availabilityRepository.GetByDentistId(dentistId);
            if (availabilities == null || !availabilities.Any())
                throw new AppValidationException("No se encontraron horarios disponibles para este dentista.");

            return availabilities;
        }

        public void SetAvailability(int dentistId, List<Availability> slots)
        {
            if (slots == null || !slots.Any())
                throw new AppValidationException("Debe proporcionar al menos un horario.");

            var existingSlots = _availabilityRepository.GetByDentistId(dentistId).ToList();

            foreach (var slot in slots)
            {
                slot.DentistId = dentistId;

                // Buscar si ya existe un slot con mismo día y hora de inicio
                var existing = existingSlots.FirstOrDefault(s =>
                    s.DayOfWeek == slot.DayOfWeek
                );

                if (existing != null)
                {
                    // Actualizar si cambió algo hora de fin o de inicio
                    existing.StartTime = slot.StartTime;
                    existing.EndTime = slot.EndTime;
                    _availabilityRepository.Update(existing);
                }
                else
                {
                    // Crear nuevo
                    _availabilityRepository.Add(slot);
                }
            }
        }
    }
}
