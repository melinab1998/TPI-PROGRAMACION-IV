using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;

namespace Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _applicationDbContext;

    public UserRepository(ApplicationDbContext applicationDbcontext)
    {
        _applicationDbContext = applicationDbcontext;
    }

    public User? GetById(int id)
    {
        return _applicationDbContext.Users.Find(id);
    }

    public User? GetByEmail(string email)
    {
        return _applicationDbContext.Users.FirstOrDefault(u => u.Email == email);
    }

    public User Add(User user)
    {
        _applicationDbContext.Users.Add(user);
        _applicationDbContext.SaveChanges();
        return user;
    }

    public User Update(User user)
    {
        _applicationDbContext.Users.Update(user);
        _applicationDbContext.SaveChanges();
        return user;
    }

    public void Delete(User user)
    {
        _applicationDbContext.Users.Remove(user);
        _applicationDbContext.SaveChanges();

    }

     public List<User> List()
    {
        return _applicationDbContext.Users
        .ToList();
    }
}
