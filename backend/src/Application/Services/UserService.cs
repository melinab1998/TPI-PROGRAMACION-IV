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

        public UserService(
            IUserRepository userRepository,
            IPasswordHasher hasher,
            IJwtService jwtService)
        {
            _userRepository = userRepository;
            _hasher = hasher;
            _jwtService = jwtService;
        }

        public User Authenticate(string email, string password)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
                throw new AppValidationException("EMAIL_AND_PASSWORD_REQUIRED");

            var user = _userRepository.GetByEmail(email);

            if (user == null)
                throw new AppValidationException("INVALID_EMAIL_OR_PASSWORD");

            if (user is Dentist dentist && !dentist.IsActive)
                throw new AppValidationException("DENTIST_NOT_ACTIVATED");

            if (!_hasher.VerifyPassword(password, user.Password))
                throw new AppValidationException("INVALID_EMAIL_OR_PASSWORD");

            user.Token = _jwtService.GenerateToken(user.Id, user.GetType().Name, TimeSpan.FromHours(1));

            return user;
        }

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

                    Console.WriteLine("✅ SuperAdmin created successfully");
                }
                else
                {
                    var superAdmin = _userRepository.List().FirstOrDefault(u => u is SuperAdmin);
                    Console.WriteLine($"SuperAdmin already exists: {superAdmin?.Email}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error creating SuperAdmin: {ex.Message}");
            }
        }
    }
}



