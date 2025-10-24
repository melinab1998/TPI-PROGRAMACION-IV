using Domain.Entities;
using Domain.Interfaces;

namespace Infrastructure.Data
{
    public class AvailabilityRepository : Repository<Availability>, IAvailabilityRepository
    {
        public AvailabilityRepository(ApplicationDbContext context) : base(context) { }

        public IEnumerable<Availability> GetByDentistId(int dentistId)
        {
            return _dbSet.Where(a => a.DentistId == dentistId).ToList();
        }
    }
}
