using Domain.Entities;

namespace Domain.Interfaces;

public interface IUserRepository
{
    User? GetById(int id);
    User? GetByEmail(string email);
    User Add(User user);
    User Update(User user);
    void Delete(User user);
    List<User> List();
}
