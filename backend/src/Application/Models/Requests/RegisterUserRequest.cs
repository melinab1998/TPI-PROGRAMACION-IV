namespace Application.Models.Requests
{
    public class RegisterUserRequest
    {
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Role { get; set; } = null!; // "Patient", "Dentist" o "SuperAdmin"

        // Solo para Patient
        public string? Dni { get; set; }

        // Solo para Dentist
        public string? LicenseNumber { get; set; }
    }
}

