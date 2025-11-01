using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class TurnRepository : Repository<Turn>, ITurnRepository
    {
        public TurnRepository(ApplicationDbContext context) : base(context) { }

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

        public IEnumerable<Turn> GetTurnsByDate(DateTime date)
        {
            return _dbSet
                .Include(t => t.Dentist)
                .Include(t => t.Patient)
                .Where(t => t.AppointmentDate.Date == date.Date)
                .ToList();
        }
        public IEnumerable<Turn> GetBookedTurns(int dentistId, DateTime date)
        {
            return _dbSet
                .Include(t => t.Dentist)
                .Include(t => t.Patient)
                .Where(t =>
                    t.DentistId == dentistId &&
                    t.AppointmentDate.Date == date.Date &&
                    t.Status != TurnStatus.Cancelled)
                .ToList();
        }
    }
}
