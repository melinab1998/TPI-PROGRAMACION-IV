using Domain.Entities;

namespace Domain.Interfaces
{
    public interface IAvailabilityRepository : IRepository<Availability>
    {
        IEnumerable<Availability> GetByDentistId(int dentistId);
        IEnumerable<Availability> GetByDentistAndDay(int dentistId, DayOfWeek dayOfWeek);
    }
}
