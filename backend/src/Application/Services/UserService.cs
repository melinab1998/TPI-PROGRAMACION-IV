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
                throw new AppValidationException("Email y contraseña son obligatorios.");

            var user = _userRepository.GetByEmail(email);

            if (user == null)
                throw new AppValidationException("Email y/o contraseña incorrectos.");

            if (user is Dentist dentist && !dentist.IsActive)
                throw new AppValidationException("El dentista aún no está activado.");

            if (!_hasher.VerifyPassword(password, user.Password))
                throw new AppValidationException("Email y/o contraseña incorrectos.");

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

                    Console.WriteLine("✅ SuperAdmin creado exitosamente");
                }
                else
                {
                    var superAdmin = _userRepository.List().FirstOrDefault(u => u is SuperAdmin);
                    Console.WriteLine($"SuperAdmin ya existe: {superAdmin?.Email}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error creando SuperAdmin: {ex.Message}");
            }
        }
    }
}


