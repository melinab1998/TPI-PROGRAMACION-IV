using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class VisitRecordRepository : Repository<VisitRecord>, IVisitRecordRepository
    {
        public VisitRecordRepository(ApplicationDbContext applicationDbContext) : base(applicationDbContext) { }

        public IEnumerable<VisitRecord> GetAllVisitRecordWithTurn()
        {
            return _dbSet.Include(v => v.Turn).ToList();
        }
    }
}
