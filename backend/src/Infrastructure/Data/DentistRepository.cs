using System.Linq.Expressions;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Domain.Interfaces;


namespace Infrastructure.Data;

public class DentistRepository : IDentistRepository
{
    private readonly ApplicationDbContext _applicationDbContext;
    public DentistRepository(ApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
    }
    public Dentist? GetById(int id)
    {
        return _applicationDbContext.Dentists.Find(id);
    }

    public Dentist? GetByEmail(string email)
    {
        return _applicationDbContext.Dentists.FirstOrDefault(d => d.Email == email);
    }

    public Dentist Add(Dentist dentist)
    {
        _applicationDbContext.Dentists.Add(dentist);
        _applicationDbContext.SaveChanges();
        return dentist;
    }
    public Dentist Update(Dentist dentist)
    {
        _applicationDbContext.Dentists.Update(dentist);
        _applicationDbContext.SaveChanges();
        return dentist;
    }

    public void Delete(Dentist dentist)
    {
        _applicationDbContext.Dentists.Remove(dentist);
        _applicationDbContext.SaveChanges();
    }

    public bool LicenseExists(string licenseNumber)
    {
         return _applicationDbContext.Dentists.Any(d => d.LicenseNumber == licenseNumber);
    }

    
}