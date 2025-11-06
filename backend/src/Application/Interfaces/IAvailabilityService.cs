using Application.Models;
using Application.Models.Requests;

namespace Application.Interfaces
{
    public interface IAvailabilityService
    {
        List<AvailabilityDto> GetByDentistId(int dentistId);
        List<AvailabilityDto> CreateAvailability(int dentistId, IEnumerable<AvailabilityRequest> slots);
        AvailabilityDto UpdateAvailability(int slotId, AvailabilityRequest updatedSlot);
        Dictionary<string, List<string>> GetAvailableSlots(int dentistId, DateTime startDate, DateTime endDate);
        void DeleteAvailability(int slotId);
    }
}
