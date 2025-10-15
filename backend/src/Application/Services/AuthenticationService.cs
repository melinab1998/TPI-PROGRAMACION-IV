using Application.Interfaces;
using Domain.Entities;
using Domain.Interfaces;


namespace Application.Services;

public class AuthenticationService 
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _hasher;
    private readonly IJwtService _jwtService;

    public AuthenticationService(
        IUserRepository userRepository,
        IPasswordHasher hasher,
        IJwtService jwtService)
    {
        _userRepository = userRepository;
        _hasher = hasher;
        _jwtService = jwtService;
    }

    public User Authenticate(string Email, string Password)
    {
        // Buscamos el usuario directamente por email
        var user = _userRepository.GetByEmail(Email);
        if (user == null || (user is Dentist d && !d.IsActive))
            return null!;

        if (!_hasher.VerifyPassword(Password, user.Password))
            return null!;

        // Generamos el token
         user.Token = _jwtService.GenerateToken(user.Id, user.GetType().Name, TimeSpan.FromHours(1));

        return user;
    }

   public void CreateSuperAdminOnce(string FirstName, string LastName, string Email, string Password)
{
    try
    {
        var exists = _userRepository.List().Any(u => u is SuperAdmin);
        if (!exists)
        {
            var superAdmin = new SuperAdmin(FirstName, LastName, Email, null!);
            var hashed = _hasher.HashPassword(Password);
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

