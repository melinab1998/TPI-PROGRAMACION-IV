using Domain.Entities;

namespace Domain.Interfaces
{
    public interface ITurnRepository : IRepository<Turn>
    {
        IEnumerable<Turn> GetTurnsByDentist(int dentistId);
        IEnumerable<Turn> GetTurnsByPatient(int patientId);
        IEnumerable<Turn> GetBookedTurns(int dentistId, DateTime date);
        IEnumerable<Turn> GetTurnsByDate(DateTime date);
    }
}
