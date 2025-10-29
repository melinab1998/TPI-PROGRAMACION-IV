using Application.Models;
using Application.Models.Requests;

namespace Application.Interfaces
{
    public interface IAvailabilityService
    {
        IEnumerable<AvailabilityDto> GetByDentistId(int dentistId);
        void CreateAvailability(int dentistId, IEnumerable<AvailabilityRequest> slots);
        void UpdateAvailability(int slotId, AvailabilityRequest updatedSlot);
    }
}
