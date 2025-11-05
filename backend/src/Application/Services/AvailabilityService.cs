using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;

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

        public List<AvailabilityDto> GetByDentistId(int dentistId)
        {
            var availabilities = _availabilityRepository.GetByDentistId(dentistId);

            if (availabilities == null || !availabilities.Any())
                return new List<AvailabilityDto>();

            return AvailabilityDto.CreateList(availabilities);
        }

        public List<AvailabilityDto> CreateAvailability(int dentistId, IEnumerable<AvailabilityRequest> slots)
        {
            if (slots == null || !slots.Any())
                throw new AppValidationException("MANDATORY_FIELDS");

            var existingSlots = _availabilityRepository.GetByDentistId(dentistId).ToList();
            var createdSlots = new List<AvailabilityDto>();

            foreach (var slotRequest in slots)
            {
                // Convertir los strings a TimeSpan
                var startTime = TimeSpan.Parse(slotRequest.StartTime);
                var endTime = TimeSpan.Parse(slotRequest.EndTime);

                // Validar que los horarios sean múltiplos de 30 minutos
                if (startTime.Minutes % 30 != 0 || endTime.Minutes % 30 != 0)
                    throw new AppValidationException("AVAILABILITY_MUST_BE_ON_HALF_HOUR");

                // Validar que el rango horario sea correcto
                if (startTime >= endTime)
                    throw new AppValidationException("INVALID_TIME_RANGE");

                var newSlot = new Availability(
                slotRequest.DayOfWeek,
                startTime.ToString(@"hh\:mm"),
                endTime.ToString(@"hh\:mm"),
                dentistId
                );

                // Validar superposición
                bool overlaps = existingSlots
                    .Where(s => s.DayOfWeek == newSlot.DayOfWeek)
                    .Any(s => !(newSlot.EndTime <= s.StartTime || newSlot.StartTime >= s.EndTime));

                if (overlaps)
                    throw new AppValidationException("TIME_SLOT_OVERLAP");

                _availabilityRepository.Add(newSlot);
                existingSlots.Add(newSlot);
                createdSlots.Add(AvailabilityDto.Create(newSlot));
            }

            return createdSlots;
        }

        public AvailabilityDto UpdateAvailability(int slotId, AvailabilityRequest updatedSlot)
        {
            var slot = _availabilityRepository.GetById(slotId);
            if (slot == null)
                throw new NotFoundException("SLOT_NOT_FOUND");

            //Usamos el metodo de la entidad
            slot.Update(updatedSlot.DayOfWeek, updatedSlot.EndTime, updatedSlot.StartTime);

            // Validar superposición
            var otherSlots = _availabilityRepository.GetByDentistId(slot.DentistId)
                .Where(s => s.Id != slotId && s.DayOfWeek == slot.DayOfWeek);

            bool overlaps = otherSlots.Any(s => !(slot.EndTime <= s.StartTime || slot.StartTime >= s.EndTime));
            if (overlaps)
                throw new AppValidationException("TIME_SLOT_OVERLAP");

            _availabilityRepository.Update(slot);
            return AvailabilityDto.Create(slot);
        }

        //Metodo necesario para el front
        public Dictionary<string, List<string>> GetAvailableSlots(int dentistId, DateTime startDate, DateTime endDate)
        {
            if (startDate > endDate)
                throw new AppValidationException("INVALID_DATE_RANGE");

            var availabilities = _availabilityRepository.GetByDentistId(dentistId).ToList();
            if (!availabilities.Any())
                throw new NotFoundException("NO_AVAILABILITY_DEFINED");

            var bookedTurns = _turnRepository.GetBookedTurnsInRange(dentistId, startDate, endDate).ToList();
            var result = new Dictionary<string, List<string>>();

            for (var date = startDate.Date; date <= endDate.Date; date = date.AddDays(1))
            {
                var dayAvailability = availabilities.Where(a => a.DayOfWeek == date.DayOfWeek).ToList();
                if (!dayAvailability.Any()) continue;

                var availableHours = new List<string>();

                foreach (var slot in dayAvailability)
                {
                    var current = slot.StartTime;
                    while (current < slot.EndTime)
                    {
                        var next = current.Add(TimeSpan.FromMinutes(30));
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
