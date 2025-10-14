using Domain.Entities;

namespace Domain.Interfaces
{
    public interface IUserRepository : IRepository<User>;
    
        // Si en el futuro necesitamos métodos específicos de User, los agregamos acá
    
}
