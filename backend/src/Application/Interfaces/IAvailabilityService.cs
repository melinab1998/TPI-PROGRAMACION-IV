using Application.Models;
using Application.Models.Requests;

namespace Application.Interfaces
{
    public interface IAvailabilityService
    {
        IEnumerable<AvailabilityDto> GetByDentistId(int dentistId);
        IEnumerable<string> GetAvailableSlots(int dentistId, DateTime date);
        void CreateAvailability(int dentistId, IEnumerable<AvailabilityRequest> slots);
        void UpdateAvailability(int slotId, AvailabilityRequest updatedSlot);

    }
}
