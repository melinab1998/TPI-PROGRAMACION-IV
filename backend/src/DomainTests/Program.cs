using System;
using Domain.Entities;
using Domain.Enums;

class Program
{
    static void Main()
    {
        Console.WriteLine("=== Pruebas completas de dominio ===\n");

        // Para registrar todos los errores
        void LogError(string context, Exception ex)
        {
            Console.WriteLine($"[ERROR] {context}: {ex.Message}");
        }

        // ----- HealthInsurance y HealthPlan -----
        HealthInsurance insurance = null!;
        HealthPlan plan = null!;
        HealthPlan plan2 = null!;
        try
        {
            insurance = new HealthInsurance("OSDE");
            plan = new HealthPlan("Plan 210");
            plan2 = new HealthPlan("Plan 310");
            insurance.AddPlan(plan);
            insurance.AddPlan(plan2);

            Console.WriteLine($"Obra social creada: {insurance.Name}");
            Console.WriteLine($"Plan agregado: {plan.Name}, pertenece a: {plan.HealthInsurance.Name}");
            foreach (var p in insurance.Plans)
            {
                Console.WriteLine($"- {p.Name}, pertenece a: {p.HealthInsurance.Name}");
            }
        }
        catch (Exception ex)
        {
            LogError("HealthInsurance/Plan", ex);
        }

        Console.WriteLine();

        // ----- Patient válido -----
        Patient patient = null!;
        try
        {
            patient = new Patient("Lautaro", "Gonzalez", "lautaro@example.com", "Pass123", "12345678");
            plan.Id = 1; // asignamos un id simulado
            patient.CompleteDataForTurn(
                birthDate: new DateOnly(1995, 5, 19),
                address: "Calle Falsa 123",
                phoneNumber: "3411234567",
                city: "Rosario",
                membershipNumber: "AFF123",
                healthPlanId: plan.Id
            );
            patient.HealthPlan = plan;

            Console.WriteLine($"Paciente creado: {patient.FirstName} {patient.LastName}, DNI: {patient.Dni}, Plan: {patient.HealthPlan?.Name}");
        }
        catch (Exception ex)
        {
            LogError("Patient", ex);
        }

        Console.WriteLine();

        // ----- Patient con errores (segundo registro) -----
        try
        {
            var patientError = new Patient("Lauti", "Gonzalez", "correo@invalido.com", "L123456", "45506124");
            patientError.CompleteDataForTurn(
                birthDate: new DateOnly(2025, 1, 1),
                address: "Calle 123",
                phoneNumber: "1234567",
                city: "rOSARIO",
                membershipNumber: "12345",
                healthPlanId: 1
            );
            Console.WriteLine($"Paciente creado: {patientError.FirstName} {patientError.LastName}, DNI: {patientError.Dni}");
        }
        catch (Exception ex)
        {
            LogError("Patient con errores", ex);
        }

        Console.WriteLine();

        // ----- Dentist válido -----
        Dentist dentist = null!;
        try
        {
            dentist = new Dentist("Carlos", "Lopez", "carlos@example.com", "Dent123", "12345");
            dentist.Id = 1; // asignamos un id simulado
            Console.WriteLine($"Dentista creado: {dentist.FirstName} {dentist.LastName}, Matrícula: {dentist.LicenseNumber}");
        }
        catch (Exception ex)
        {
            LogError("Dentist", ex);
        }

        Console.WriteLine();

        // ----- Availability -----
        Availability availability = null!;
        try
        {
            availability = new Availability(WorkDay.Monday, new TimeOnly(13, 0), new TimeOnly(16, 0), dentist.Id);
            Console.WriteLine($"Disponibilidad creada: {availability.DayOfWeek} de {availability.StartTime} a {availability.EndTime}");
        }
        catch (Exception ex)
        {
            LogError("Availability", ex);
        }

        Console.WriteLine();

        // ----- Turn -----
        Turn turn = null!;
        try
        {
            patient.Id = 1; // asignamos un id simulado
            var appointmentDate = DateTime.Now.AddHours(2);
            turn = new Turn(appointmentDate, TurnStatus.Pending, "Revisión", patient.Id, dentist.Id);
            Console.WriteLine($"Turno creado: {turn.AppointmentDate}, tipo: {turn.ConsultationType}, estado: {turn.Status}");


            turn.MarkAsCancelled();
            Console.WriteLine($"Turno cancelado: {turn.Status}");
            // Marcar como completado

        }
        catch (Exception ex)
        {
            LogError("Turn", ex);
        }

        Console.WriteLine();

        // ----- VisitRecord -----
        try
        {
            turn.Id = 1; // asignamos un id simulado
            VisitRecord visitRecord = new VisitRecord(
                visitDate: DateOnly.FromDateTime(DateTime.Now),
                treatment: "Limpieza dental",
                diagnosis: "Sin caries",
                notes: "Todo bien",
                prescription: null,
                turnId: turn.Id
            );

            Console.WriteLine($"VisitRecord creado: {visitRecord.VisitDate}, Tratamiento: {visitRecord.Treatment}, Diagnóstico: {visitRecord.Diagnosis}");
        }
        catch (Exception ex)
        {
            LogError("VisitRecord", ex);
        }

        Console.WriteLine("\n=== Fin de pruebas completas ===");
    }

}
