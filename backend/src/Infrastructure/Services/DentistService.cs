using Application.Interfaces;
using Application.Models.Requests;
using Domain.Entities;
using Infrastructure.Data;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services;
public class DentistService : IDentistService
{
    private readonly ApplicationDbContext _context;
    private readonly IPasswordHasher _hasher;
    private readonly IEmailService _emailService;
    private readonly IJwtService _jwtService;

    public DentistService(ApplicationDbContext context, IPasswordHasher hasher, IEmailService emailService, IJwtService jwtService)
    {
        _context = context;
        _hasher = hasher;
        _emailService = emailService;
        _jwtService = jwtService;
    }

    public async Task<Dentist> CreateDentist(CreateDentistRequest request)
    {
        if (_context.Users.Any(u => u.Email == request.Email))
            throw new Exception($"El email {request.Email} ya está registrado");

        if (_context.Dentists.Any(d => d.LicenseNumber == request.LicenseNumber))
            throw new Exception($"La matrícula {request.LicenseNumber} ya está registrada");

        var dentist = new Dentist(request.FirstName, request.LastName, request.Email, request.LicenseNumber);

        var tempPassword = GenerateTemporaryPassword();
        dentist.Activate(_hasher.HashPassword(tempPassword));

        _context.Dentists.Add(dentist);
        await _context.SaveChangesAsync();

        var activationToken = _jwtService.GenerateActivationToken(dentist.Id);
        await _emailService.SendActivationEmailAsync(dentist.Email, activationToken);

        return dentist;
    }

    public async Task ActivateDentist(ActivateDentistRequest dto)
{
    Console.WriteLine("🔹 Validando token...");
    var principal = _jwtService.ValidateToken(dto.Token);
    var dentistIdClaim = principal.FindFirst("dentistId");
    Console.WriteLine($"Claim dentistId: {dentistIdClaim?.Value}");

    if (dentistIdClaim == null)
        throw new Exception("Token inválido o dentistId no encontrado.");

    int dentistId = int.Parse(dentistIdClaim.Value);

    Console.WriteLine($"🔹 Buscando dentista con Id: {dentistId}");
    var dentist = await _context.Dentists.FirstOrDefaultAsync(d => d.Id == dentistId);
    if (dentist == null) throw new Exception("Dentista no encontrado");

    Console.WriteLine($"🔹 Activando dentista: {dentist.Email}");
    dentist.Activate(_hasher.HashPassword(dto.Password));
    await _context.SaveChangesAsync();
    Console.WriteLine("✅ Dentista activado correctamente");
}


    private string GenerateTemporaryPassword()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var random = new Random();
        return "Tmp-" + new string(Enumerable.Repeat(chars, 10).Select(s => s[random.Next(s.Length)]).ToArray());
    }
}
