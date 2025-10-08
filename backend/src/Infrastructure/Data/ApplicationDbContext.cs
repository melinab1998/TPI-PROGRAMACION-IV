using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        // DbSets concretos
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Availability> Availabilities { get; set; }

        // Opcional: si quieres acceder a todos los Users
        public DbSet<User> Users { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) 
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurar herencia TPH
            modelBuilder.Entity<User>()
                .HasDiscriminator<string>("UserType")
                .HasValue<Patient>("Patient");
                // .HasValue<Dentist>("Dentist")
                // .HasValue<Admin>("Admin");
        }
    }
}
