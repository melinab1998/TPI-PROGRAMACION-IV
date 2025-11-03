using Domain.Entities;

namespace Domain.Interfaces
{
    public interface ITurnRepository : IRepository<Turn>
    {
        IEnumerable<Turn> GetTurnsByDentist(int dentistId);
        IEnumerable<Turn> GetTurnsByPatient(int patientId); 
        IEnumerable<Turn> GetTurnsByDate(DateTime date);
        IEnumerable<Turn> GetBookedTurnsInRange(int dentistId, DateTime startDate, DateTime endDate);

    }
}
