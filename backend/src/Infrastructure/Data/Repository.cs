using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly ApplicationDbContext _applicationDbcontext;
        protected readonly DbSet<T> _dbSet;

        public Repository(ApplicationDbContext applicationDbcontext)
        {
            _applicationDbcontext = applicationDbcontext;
            _dbSet = _applicationDbcontext.Set<T>();
        }
        public virtual T? GetById(int id)
        {
            return _dbSet.Find(id);
        }
        public virtual IEnumerable<T> List()
        {
            return _dbSet.ToList();
        }

        public virtual T Add(T entity)
        {
            _dbSet.Add(entity);
            _applicationDbcontext.SaveChanges();
            return entity;
        }

        public virtual T Update(T entity)
        {
            _dbSet.Update(entity);
            _applicationDbcontext.SaveChanges();
            return entity;
        }

        public virtual void Delete(T entity)
        {
            _dbSet.Remove(entity);
            _applicationDbcontext.SaveChanges();
        }
    }
}
