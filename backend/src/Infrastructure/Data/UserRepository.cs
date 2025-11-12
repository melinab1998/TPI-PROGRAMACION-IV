using Domain.Entities;
using Domain.Interfaces;

namespace Infrastructure.Data
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public UserRepository(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
        {
            _dbContext = applicationDbContext;
        }

        public User? GetByEmail(string email)
        {
            var normalizedEmail = email.Trim().ToLower();

            // Buscamos en pacientes
            var patient = _dbContext.Patients
                .FirstOrDefault(p => p.Email.ToLower() == normalizedEmail);
            if (patient != null) return patient;

            // Buscamos en dentistas
            var dentist = _dbContext.Dentists
                .FirstOrDefault(d => d.Email.ToLower() == normalizedEmail);
            if (dentist != null) return dentist;

            // Buscamos en superadmins
            var admin = _dbContext.SuperAdmins
                .FirstOrDefault(a => a.Email.ToLower() == normalizedEmail);
            if (admin != null) return admin;

            return null;
        }
    }
}
