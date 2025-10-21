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

            // Primero eliminamos las disponibilidades actuales de ese dentista
            var existingSlots = _availabilityRepository.GetByDentistId(dentistId).ToList();
            foreach (var slot in existingSlots)
            {
                _availabilityRepository.Delete(slot);
            }

            // Agregamos las nuevas disponibilidades
            foreach (var slot in slots)
            {
                // Aseguramos que la disponibilidad tenga el dentistId correcto
                slot.DentistId = dentistId;
                _availabilityRepository.Add(slot);
            }
        }
    }
}
