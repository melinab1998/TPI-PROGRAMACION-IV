using Domain.Entities;
using Domain.Interfaces;
using Domain.Exceptions;
using Application.Interfaces;

namespace Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _hasher;
        private readonly IJwtService _jwtService;
        private readonly IEmailService _emailService;

        public UserService(
            IUserRepository userRepository,
            IPasswordHasher hasher,
            IJwtService jwtService,
            IEmailService emailService)
        {
            _userRepository = userRepository;
            _hasher = hasher;
            _jwtService = jwtService;
            _emailService = emailService;
        }


        // Autenticación de usuario.
        public User Authenticate(string email, string password)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
                throw new AppValidationException("EMAIL_AND_PASSWORD_REQUIRED");

            var user = _userRepository.GetByEmail(email);

            if (user == null || !_hasher.VerifyPassword(password, user.Password))
                throw new UnauthorizedException("INVALID_EMAIL_OR_PASSWORD");

            if (user is Dentist dentist && !dentist.IsActive)
                throw new UnauthorizedException("DENTIST_NOT_ACTIVATED");

            user.Token = _jwtService.GenerateToken(user.Id, user.GetType().Name, TimeSpan.FromHours(1));

            return user;
        }

        // Enviar correo de recuperación de contraseña.
        public async Task SendPasswordResetEmailAsync(string email)
        {
            var user = _userRepository.GetByEmail(email);
            if (user == null)
                throw new NotFoundException("USER_NOT_FOUND");

            var token = _jwtService.GeneratePasswordResetToken(user.Id, TimeSpan.FromHours(1));
            await _emailService.SendPasswordResetEmailAsync(email, token);
        }

        // Restablecer contraseña usando el token recibido.
        public void ResetPassword(string token, string newPassword)
        {
            var principal = _jwtService.ValidatePasswordResetToken(token);
            var userIdClaim = principal.Claims.First(c => c.Type == "passwordResetUserId").Value;
            var userId = int.Parse(userIdClaim);

            var user = _userRepository.GetById(userId);
            if (user == null)
                throw new NotFoundException("USER_NOT_FOUND");

            var hashed = _hasher.HashPassword(newPassword);
            user.SetPassword(hashed);
            _userRepository.Update(user);
        }

        // Crear automáticamente un SuperAdmin (solo si no existe aún).
        public void CreateSuperAdminOnce(string firstName, string lastName, string email, string password)
        {
            try
            {
                var exists = _userRepository.List().Any(u => u is SuperAdmin);
                if (!exists)
                {
                    var superAdmin = new SuperAdmin(firstName, lastName, email, null!);
                    var hashed = _hasher.HashPassword(password);
                    superAdmin.SetPassword(hashed);
                    _userRepository.Add(superAdmin);

                    Console.WriteLine("SuperAdmin created successfully");
                }
                else
                {
                    var superAdmin = _userRepository.List().FirstOrDefault(u => u is SuperAdmin);
                    Console.WriteLine($"SuperAdmin already exists: {superAdmin?.Email}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating SuperAdmin: {ex.Message}");
            }
        }
    }
}



