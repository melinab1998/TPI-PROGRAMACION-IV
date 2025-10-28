using Application.Models;
using Application.Models.Requests;

namespace Application.Interfaces
{
    public interface IAvailabilityService
    {
        IEnumerable<AvailabilityDto> GetByDentistId(int dentistId);
        void SetAvailability(int dentistId, IEnumerable<AvailabilityRequest> slots);
    }
}
