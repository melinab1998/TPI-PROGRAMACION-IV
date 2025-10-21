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

        // DbSets para obras sociales y planes
        public DbSet<HealthInsurance> HealthInsurances { get; set; }
        public DbSet<HealthPlan> HealthPlans { get; set; }

        // DbSet general para User (útil para login)
        public DbSet<User> Users { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // 🔹 Un solo OnModelCreating con todo dentro
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Table-Per-Type (TPT)
            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<Patient>().ToTable("Patients");
            modelBuilder.Entity<Dentist>().ToTable("Dentists");
            modelBuilder.Entity<SuperAdmin>().ToTable("SuperAdmins");

            // Configuraciones específicas
            modelBuilder.Entity<Patient>()
                .Property(p => p.Dni)
                .IsRequired();

            //Semillas de datos (HealthInsurance y HealthPlan)
            modelBuilder.Entity<HealthInsurance>().HasData(CreateHealthInsuranceSeed());
            modelBuilder.Entity<HealthPlan>().HasData(CreateHealthPlanSeed());
        }

        
        private HealthInsurance[] CreateHealthInsuranceSeed()
        {
            return new[]
            {
                new HealthInsurance { Id = 1, Name = "OSDE" },
                new HealthInsurance { Id = 2, Name = "Swiss Medical" },
                new HealthInsurance { Id = 3, Name = "Galeno" },
                new HealthInsurance { Id = 4, Name = "Particular" }
            };
        }

        private HealthPlan[] CreateHealthPlanSeed()
        {
            return new[]
            {
                new HealthPlan { Id = 1, Name = "210", HealthInsuranceId = 1 },
                new HealthPlan { Id = 2, Name = "310", HealthInsuranceId = 1 },
                new HealthPlan { Id = 3, Name = "410", HealthInsuranceId = 1 },
                new HealthPlan { Id = 4, Name = "SMG01", HealthInsuranceId = 2 },
                new HealthPlan { Id = 5, Name = "SMG02", HealthInsuranceId = 2 },
                new HealthPlan { Id = 6, Name = "220", HealthInsuranceId = 3 },
                new HealthPlan { Id = 7, Name = "330", HealthInsuranceId = 3 }
            };
        }
    }
}
