using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;
public class Repository<T> : IRepository<T> where T : class
{
    protected readonly ApplicationDbContext _applicationDbcontext;
    protected readonly DbSet<T> _dbSet;

    public Repository(ApplicationDbContext applicationDbcontext)
    {
        _applicationDbcontext = applicationDbcontext;
        _dbSet = _applicationDbcontext.Set<T>();
    }

    public T GetById(int id) => _dbSet.Find(id)!;

   
    public IEnumerable<T> List() => _dbSet.ToList();

    public T Add(T entity)
    {
        _dbSet.Add(entity);
        _applicationDbcontext.SaveChanges();
        return entity;
    }

    public T Update(T entity)
    {
        _dbSet.Update(entity);
        _applicationDbcontext.SaveChanges();
        return entity;
    }

    public void Delete(T entity)
    {
        _dbSet.Remove(entity);
        _applicationDbcontext.SaveChanges();
    }

}