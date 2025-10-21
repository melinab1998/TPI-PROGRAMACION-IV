using Application.Interfaces;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;


namespace Application.Services;

public class DentistService : IDentistService
{
    private readonly IDentistRepository _dentistRepository;
    private readonly IPasswordHasher _hasher;
    private readonly IEmailService _emailService;
    private readonly IJwtService _jwtService;

    public DentistService(IDentistRepository dentistRepository, IPasswordHasher hasher, IEmailService emailService, IJwtService jwtService)
    {
        _dentistRepository = dentistRepository;
        _hasher = hasher;
        _emailService = emailService;
        _jwtService = jwtService;
    }

    public Dentist CreateDentist(string FirstName, string LastName, string Email, string LicenseNumber)
    {
        if (_dentistRepository.GetByEmail(Email) != null)
            throw new AppValidationException($"El email {Email} ya está registrado");

        if (_dentistRepository.LicenseExists(LicenseNumber))
            throw new AppValidationException($"La matrícula {LicenseNumber} ya está registrada");

        var dentist = new Dentist(FirstName, LastName, Email, LicenseNumber);

        var tempPassword = GenerateTemporaryPassword();
        dentist.Activate(_hasher.HashPassword(tempPassword));

        _dentistRepository.Add(dentist);


        var activationToken = _jwtService.GenerateActivationTokenForDentist(dentist.Id);

        _emailService.SendActivationEmailAsync(dentist.Email, activationToken);

        return dentist;
    }

    public void ActivateDentist(string Token, string Password)
    {
        Console.WriteLine("🔹 Validando token...");
        var principal = _jwtService.ValidateToken(Token);
        var dentistIdClaim = principal.FindFirst("dentistId");
        Console.WriteLine($"Claim dentistId: {dentistIdClaim?.Value}");

        if (dentistIdClaim == null)
            throw new AppValidationException("Token inválido o dentistId no encontrado.");

        int dentistId = int.Parse(dentistIdClaim.Value);

        Console.WriteLine($"🔹 Buscando dentista con Id: {dentistId}");
        var dentist = _dentistRepository.GetById(dentistId);
        if (dentist == null) throw new AppValidationException("Dentista no encontrado");

        Console.WriteLine($"🔹 Activando dentista: {dentist.Email}");
        dentist.Activate(_hasher.HashPassword(Password));
        _dentistRepository.Update(dentist);
        Console.WriteLine("✅ Dentista activado correctamente");
    }


    private string GenerateTemporaryPassword()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var random = new Random();
        return "Tmp-" + new string(Enumerable.Repeat(chars, 10).Select(s => s[random.Next(s.Length)]).ToArray());
    }


    public Dentist GetDentistById(int id)
    {
        var dentist = _dentistRepository.GetById(id);
        if (dentist == null) throw new AppValidationException("Dentista no encontrado");
        return dentist;
    }

    public IEnumerable<Dentist> GetAllDentists()
    {
        var dentists = _dentistRepository.List();
        if (dentists == null || !dentists.Any())
            throw new AppValidationException("No se encontraron dentistas registrados.");
        return dentists;
    }

    public Dentist UpdateDentist(int id, string? firstName, string? lastName, string? email, string? licenseNumber)
    {
        var dentist = _dentistRepository.GetById(id);
        if (dentist == null)
            throw new AppValidationException("Dentista no encontrado");

        if (!string.IsNullOrEmpty(email) && _dentistRepository.GetByEmail(email) != null && email != dentist.Email)
            throw new AppValidationException($"El email {email} ya está registrado");

        if (!string.IsNullOrEmpty(licenseNumber) && _dentistRepository.LicenseExists(licenseNumber) && licenseNumber != dentist.LicenseNumber)
            throw new AppValidationException($"La matrícula {licenseNumber} ya está registrada");

        if (!string.IsNullOrEmpty(firstName)) dentist.FirstName = firstName;
        if (!string.IsNullOrEmpty(lastName)) dentist.LastName = lastName;
        if (!string.IsNullOrEmpty(email)) dentist.Email = email;
        if (!string.IsNullOrEmpty(licenseNumber)) dentist.LicenseNumber = licenseNumber;

        _dentistRepository.Update(dentist);

        return dentist;
    }

    public Dentist SetActiveStatusByAdmin(int id, bool isActive)
    {
        var dentist = _dentistRepository.GetById(id);
        if (dentist == null)
            throw new AppValidationException("Dentista no encontrado");

        dentist.IsActive = isActive; 
        _dentistRepository.Update(dentist);

        return dentist;
    }
}

