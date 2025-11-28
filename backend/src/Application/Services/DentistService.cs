using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;

namespace Application.Services
{
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

        // Obtiene todos los dentistas registrados en el sistema.
        public List<DentistDto> GetAllDentists()
        {
            var dentists = _dentistRepository.List();
            if (!dentists.Any())
                return new List<DentistDto>();

            return DentistDto.CreateList(dentists);
        }

        // Obtiene la información de un dentista específico por su identificador.
        public DentistDto GetDentistById(int id)
        {
            var dentist = _dentistRepository.GetById(id)
                ?? throw new NotFoundException("DENTIST_NOT_FOUND");

            return DentistDto.Create(dentist);
        }

        // Actualiza los datos de un dentista, validando que el correo y la matrícula sean únicos.
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

            dentist.UpdateInfo(request.FirstName, request.LastName, request.Email, request.LicenseNumber);

            _dentistRepository.Update(dentist);
            return DentistDto.Create(dentist);
        }

        // Actualizar obras sociales que acepta un dentista
        public DentistDto UpdateDentistInsurances(int id, UpdateDentistInsurancesRequest request)
        {
            var dentist = _dentistRepository.GetById(id)
                ?? throw new NotFoundException("DENTIST_NOT_FOUND");

            dentist.DentistHealthInsurances.Clear();

            if (request.HealthInsuranceIds != null)
            {
                foreach (var healthInsuranceId in request.HealthInsuranceIds.Distinct())
                {
                    dentist.DentistHealthInsurances.Add(new DentistHealthInsurance
                    {
                        DentistId = dentist.Id,
                        HealthInsuranceId = healthInsuranceId
                    });
                }
            }

            _dentistRepository.Update(dentist);

            var reloadedDentist = _dentistRepository.GetById(id)
                ?? throw new NotFoundException("DENTIST_NOT_FOUND");

            return DentistDto.Create(reloadedDentist);
        }

        // Activa la cuenta de un dentista utilizando un token de activación y establece su contraseña.
        public void ActivateDentist(string token, string password)
        {
            var principal = _jwtService.ValidateToken(token);
            var dentistIdClaim = principal.FindFirst("dentistId");

            if (dentistIdClaim == null)
                throw new UnauthorizedException("INVALID_TOKEN");

            int dentistId = int.Parse(dentistIdClaim.Value);
            var dentist = _dentistRepository.GetById(dentistId);
            if (dentist == null)
                throw new NotFoundException("DENTIST_NOT_FOUND");

            dentist.Activate(_hasher.HashPassword(password));
            _dentistRepository.Update(dentist);
        }

        // Crea un nuevo dentista (por parte del SuperAdmin), valida duplicados y envía un correo de activación.
        public ActivationResponseDto<DentistDto> CreateDentist(CreateDentistRequest request)
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

            return new ActivationResponseDto<DentistDto>(DentistDto.Create(dentist), activationToken);
        }

        // Permite al SuperAdmin activar o desactivar la cuenta de un dentista.
        public DentistDto SetActiveStatusByAdmin(int id, bool isActive)
        {
            var dentist = _dentistRepository.GetById(id)
                ?? throw new NotFoundException("DENTIST_NOT_FOUND");

            dentist.SetActiveStatus(isActive);
            _dentistRepository.Update(dentist);

            return DentistDto.Create(dentist);
        }

        // Genera una contraseña temporal aleatoria para nuevos dentistas.
        private string GenerateTemporaryPassword()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new Random();
            return "Tmp-" + new string(Enumerable.Repeat(chars, 10)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}



