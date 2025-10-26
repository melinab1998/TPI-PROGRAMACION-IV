using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class PatientRepository : Repository<Patient>, IPatientRepository
    {
        public PatientRepository(ApplicationDbContext applicationDbContext)
            : base(applicationDbContext) { }

        public override Patient? GetById(int id)
        {
            return _dbSet
                .Include(p => p.HealthPlan)
                .ThenInclude(hp => hp.HealthInsurance)
                .FirstOrDefault(p => p.Id == id);
        }

        public override IEnumerable<Patient> List()
        {
            return _dbSet
                .Include(p => p.HealthPlan)
                .ThenInclude(hp => hp.HealthInsurance)
                .ToList();
        }

        public Patient? GetByDni(string dni)
        {
            return _dbSet
                .Include(p => p.HealthPlan)
                .ThenInclude(hp => hp.HealthInsurance)
                .FirstOrDefault(p => p.Dni == dni);
        }

        public Patient? GetByEmail(string email)
        {
            return _dbSet
                .Include(p => p.HealthPlan)
                .ThenInclude(hp => hp.HealthInsurance)
                .FirstOrDefault(p => p.Email == email);
        }
    }
}

