using Domain.Entities;
using Domain.Interfaces;

namespace Infrastructure.Data
{
    public class DentistRepository : Repository<Dentist>, IDentistRepository
    {
        public DentistRepository(ApplicationDbContext applicationDbContext) : base(applicationDbContext) { }

        public bool LicenseExists(string licenseNumber)
        {
            return _dbSet.Any(d => d.LicenseNumber == licenseNumber);
        }

         public Dentist? GetByEmail(string email)
        {
            return _dbSet.FirstOrDefault(d => d.Email == email);
        }
    }
}
