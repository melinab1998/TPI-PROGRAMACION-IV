
using Domain.Entities;

namespace Application.Interfaces
{
    public interface IAvailabilityService
    {
        IEnumerable<Availability> GetByDentistId(int dentistId);
        void SetAvailability(int dentistId, List<Availability> slots);
    }
}
