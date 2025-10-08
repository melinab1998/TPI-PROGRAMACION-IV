using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        // DbSets concretos
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Dentist> Dentists { get; set; }
        public DbSet<SuperAdmin> SuperAdmins { get; set; }
        public DbSet<Availability> Availabilities { get; set; }

        // DbSet general para User (opcional, útil para login)
        public DbSet<User> Users { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Herencia TPH
            modelBuilder.Entity<User>()
                .HasDiscriminator<string>("UserType")
                .HasValue<Patient>("Patient")
                .HasValue<Dentist>("Dentist")
                .HasValue<SuperAdmin>("SuperAdmin");
        }
    }
}

