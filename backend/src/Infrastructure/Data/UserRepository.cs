using Domain.Entities;
using Domain.Interfaces;

namespace Infrastructure.Data
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(ApplicationDbContext applicationDbContext) : base(applicationDbContext) { }

        public User? GetByEmail(string email)
        {
            return _dbSet.FirstOrDefault(u => u.Email == email);
        }
    }
}
