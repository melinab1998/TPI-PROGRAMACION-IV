using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;

namespace Application.Services;

public class DentistService : IDentistService
{
    private readonly IDentistRepository _dentistRepository;
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _hasher;
    private readonly IEmailService _emailService;
    private readonly IJwtService _jwtService;

    public DentistService(
        IDentistRepository dentistRepository,
        IUserRepository userRepository,
        IPasswordHasher hasher,
        IEmailService emailService,
        IJwtService jwtService)
    {
        _dentistRepository = dentistRepository;
        _userRepository = userRepository;
        _hasher = hasher;
        _emailService = emailService;
        _jwtService = jwtService;
    }

    public DentistDto CreateDentist(CreateDentistRequest request)
    {
        if (_userRepository.GetByEmail(request.Email) != null)
            throw new AppValidationException("EMAIL_ALREADY_EXISTS");

        if (_dentistRepository.LicenseExists(request.LicenseNumber))
            throw new AppValidationException("LICENSE_ALREADY_EXISTS");

        var dentist = new Dentist(request.FirstName, request.LastName, request.Email, request.LicenseNumber);

        var tempPassword = GenerateTemporaryPassword();
        dentist.Activate(_hasher.HashPassword(tempPassword));

        _dentistRepository.Add(dentist);

        var activationToken = _jwtService.GenerateActivationTokenForDentist(dentist.Id);
        _emailService.SendActivationEmailAsync(dentist.Email, activationToken);

        return DentistDto.Create(dentist);
    }

    public void ActivateDentist(string token, string password)
    {
        var principal = _jwtService.ValidateToken(token);
        var dentistIdClaim = principal.FindFirst("dentistId");

        if (dentistIdClaim == null)
            throw new AppValidationException("INVALID_TOKEN");

        int dentistId = int.Parse(dentistIdClaim.Value);
        var dentist = _dentistRepository.GetById(dentistId);
        if (dentist == null)
            throw new AppValidationException("DENTIST_NOT_FOUND");

        dentist.Activate(_hasher.HashPassword(password));
        _dentistRepository.Update(dentist);
    }

    private string GenerateTemporaryPassword()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var random = new Random();
        return "Tmp-" + new string(Enumerable.Repeat(chars, 10)
            .Select(s => s[random.Next(s.Length)]).ToArray());
    }

    public DentistDto GetDentistById(int id)
    {
        var dentist = _dentistRepository.GetById(id)
            ?? throw new NotFoundException("DENTIST_NOT_FOUND");

        return DentistDto.Create(dentist);
    }

    public IEnumerable<DentistDto> GetAllDentists()
    {
        var dentists = _dentistRepository.List();
        if (dentists == null || !dentists.Any())
            throw new NotFoundException("NO_DENTISTS_FOUND");

        return dentists.Select(DentistDto.Create);
    }

    public DentistDto UpdateDentist(int id, UpdateDentistRequest request)
    {
        var dentist = _dentistRepository.GetById(id)
            ?? throw new NotFoundException("DENTIST_NOT_FOUND");

        if (!string.IsNullOrEmpty(request.Email) && 
            _userRepository.GetByEmail(request.Email) != null &&
            request.Email != dentist.Email)
            throw new AppValidationException("EMAIL_ALREADY_EXISTS");

        if (!string.IsNullOrEmpty(request.LicenseNumber) && 
            _dentistRepository.LicenseExists(request.LicenseNumber) &&
            request.LicenseNumber != dentist.LicenseNumber)
            throw new AppValidationException("LICENSE_ALREADY_EXISTS");

        if (!string.IsNullOrEmpty(request.FirstName)) dentist.FirstName = request.FirstName;
        if (!string.IsNullOrEmpty(request.LastName)) dentist.LastName = request.LastName;
        if (!string.IsNullOrEmpty(request.Email)) dentist.Email = request.Email;
        if (!string.IsNullOrEmpty(request.LicenseNumber)) dentist.LicenseNumber = request.LicenseNumber;

        _dentistRepository.Update(dentist);
        return DentistDto.Create(dentist);
    }

    public DentistDto SetActiveStatusByAdmin(int id, bool isActive)
    {
        var dentist = _dentistRepository.GetById(id)
            ?? throw new NotFoundException("DENTIST_NOT_FOUND");

        dentist.IsActive = isActive;
        _dentistRepository.Update(dentist);

        return DentistDto.Create(dentist);
    }
}


