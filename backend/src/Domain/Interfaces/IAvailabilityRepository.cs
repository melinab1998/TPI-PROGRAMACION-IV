using Domain.Entities;

namespace Domain.Interfaces
{
    public interface IAvailabilityRepository : IRepository<Availability>
    {
        IEnumerable<Availability> GetByDentistId(int dentistId);
        Availability? GetByDentistAndDay(int dentistId, DayOfWeek dayOfWeek); 
    }
}
