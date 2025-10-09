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

            // Table-Per-Type (TPT)
            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<Patient>().ToTable("Patients");
            modelBuilder.Entity<Dentist>().ToTable("Dentists");
            modelBuilder.Entity<SuperAdmin>().ToTable("SuperAdmins");

            // Configuraciones opcionales de propiedades
            modelBuilder.Entity<Patient>()
                .Property(p => p.Dni)
                .IsRequired(); // Dni obligatorio solo para pacientes
        }
    }
}
