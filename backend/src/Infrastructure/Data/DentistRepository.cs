using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class DentistRepository : Repository<Dentist>, IDentistRepository
    {
        public DentistRepository(ApplicationDbContext applicationDbContext) 
            : base(applicationDbContext) 
        { 
        }
        public override IEnumerable<Dentist> List()
        {
            return _dbSet
                .Include(d => d.DentistHealthInsurances)
                    .ThenInclude(dh => dh.HealthInsurance)
                .ToList();
        }
        public override Dentist? GetById(int id)
        {
            return _dbSet
                .Include(d => d.DentistHealthInsurances)
                    .ThenInclude(dh => dh.HealthInsurance)
                .FirstOrDefault(d => d.Id == id);
        }

        public bool LicenseExists(string licenseNumber)
        {
            return _dbSet.Any(d => d.LicenseNumber == licenseNumber);
        }
        public Dentist? GetByEmail(string email)
        {
            return _dbSet
                .Include(d => d.DentistHealthInsurances)
                    .ThenInclude(dh => dh.HealthInsurance)
                .FirstOrDefault(d => d.Email == email);
        }
    }
}

