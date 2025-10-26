using Application.Models;

namespace Application.Interfaces
{
    public interface IAvailabilityService
    {
        IEnumerable<AvailabilityDto> GetByDentistId(int dentistId);
        void SetAvailability(int dentistId, IEnumerable<AvailabilityDto> slots);
    }
}
