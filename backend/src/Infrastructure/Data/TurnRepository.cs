using Domain.Entities;
using Domain.Interfaces;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class TurnRepository : Repository<Turn>, ITurnRepository
    {
        public TurnRepository(ApplicationDbContext context) : base(context) { }

        public override IEnumerable<Turn> List()
        {
            return _dbSet
                .Include(t => t.Dentist)
                .Include(t => t.Patient)
                .ToList();
        }

        public IEnumerable<Turn> GetTurnsByDentist(int dentistId)
        {
            return _dbSet
                .Include(t => t.Dentist)
                .Include(t => t.Patient)
                .Where(t => t.DentistId == dentistId)
                .ToList();
        }

        public IEnumerable<Turn> GetTurnsByPatient(int patientId)
        {
            return _dbSet
                .Include(t => t.Dentist)
                .Include(t => t.Patient)
                .Where(t => t.PatientId == patientId)
                .ToList();
        }

        public IEnumerable<Turn> GetBookedTurnsInRange(int dentistId, DateTime startDate, DateTime endDate)
        {
            return _dbSet
                .Where(t => t.DentistId == dentistId &&
                            t.AppointmentDate.Date >= startDate.Date &&
                            t.AppointmentDate.Date <= endDate.Date &&
                            t.Status != TurnStatus.Cancelled)
                .ToList();
        }
    }
}
