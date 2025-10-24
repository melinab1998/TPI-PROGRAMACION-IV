using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class PatientRepository : Repository<Patient>, IPatientRepository
    {
        public PatientRepository(ApplicationDbContext applicationDbContext) : base(applicationDbContext) { }

        public Patient? GetByDni(string dni)
        {
            return _dbSet.FirstOrDefault(p => p.Dni == dni);
        }

        public Patient? GetByEmail(string email)
        {
            return _dbSet.FirstOrDefault(p => p.Email == email);
        }
        
        
    }
}
