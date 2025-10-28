using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Infrastructure.Data
{
    public class AvailabilityRepository : Repository<Availability>, IAvailabilityRepository
    {
        public AvailabilityRepository(ApplicationDbContext context) : base(context) { }

        public IEnumerable<Availability> GetByDentistId(int dentistId)
        {
            return _dbSet.Where(a => a.DentistId == dentistId).ToList();
        }

        public IEnumerable<Availability> GetByDentistAndDay(int dentistId, DayOfWeek dayOfWeek)
        {
            return _dbSet.Where(a => a.DentistId == dentistId && a.DayOfWeek == dayOfWeek).ToList();
        }
    }
}

