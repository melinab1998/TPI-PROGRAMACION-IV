using System;
using Domain.Entities;

class Program
{
    static void Main()
    {
        Console.WriteLine("=== Pruebas de dominio ===");

        // ----- Probar Patient válido -----
        try
        {
            var patient = new Patient(
                firstName: "Lautaro",
                lastName: "Gonzalez",
                email: "lautaro@example.com",
                password: "Pass123",
                dni: "12345678"
            );

            Console.WriteLine($"Paciente creado: {patient.FirstName} {patient.LastName}, DNI: {patient.Dni}");

            // Completar datos para turno
            patient.CompleteDataForTurn(
                birthDate: new DateOnly(1995, 5, 19),
                address: "Calle Falsa 123",
                phoneNumber: "3411234567",
                city: "Rosario",
                membershipNumber: "AFF123",
                healthPlanId: 1
            );

            Console.WriteLine($"Datos completos: {patient.Address}, {patient.PhoneNumber}, {patient.City}, {patient.MembershipNumber}");
        }
        catch (ArgumentException ex)
        {
            Console.WriteLine($"Error Patient: {ex.Message}");
        }

        Console.WriteLine();

        // ----- Probar Patient con DNI inválido -----
        try
        {
            var patientInvalid = new Patient(
                firstName: "Ana",
                lastName: "Perez",
                email: "ana@examplecom",
                password: "Pass123",
                dni: "1234567"
            );
        }
        catch (ArgumentException ex)
        {
            Console.WriteLine($"Error Patient inválido: {ex.Message}");
        }

        Console.WriteLine();

        // ----- Probar Dentist válido -----
        try
        {
            var dentist = new Dentist(
                firstName: "Ca",
                lastName: "Lopez",
                email: "carlos@example.com",
                password: "Dent123",
                licenseNumber: "12345"
            );

            Console.WriteLine($"Dentista creado: {dentist.FirstName} {dentist.LastName}, Matrícula: {dentist.LicenseNumber}");
        }
        catch (ArgumentException ex)
        {
            Console.WriteLine($"Error Dentist: {ex.Message}");
        }

        Console.WriteLine("\n=== Fin de pruebas ===");
    }
}
