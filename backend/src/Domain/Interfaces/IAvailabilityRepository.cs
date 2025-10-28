using Domain.Entities;
using System;
using System.Collections.Generic;

namespace Domain.Interfaces
{
    public interface IAvailabilityRepository : IRepository<Availability>
    {
        IEnumerable<Availability> GetByDentistId(int dentistId);
        IEnumerable<Availability> GetByDentistAndDay(int dentistId, DayOfWeek dayOfWeek);
    }
}
