using Domain.Entities;

namespace Domain.Interfaces
{
    public interface IVisitRecordRepository : IRepository<VisitRecord>
    {
        IEnumerable<VisitRecord> GetAllVisitRecordWithTurn();

    }
}
