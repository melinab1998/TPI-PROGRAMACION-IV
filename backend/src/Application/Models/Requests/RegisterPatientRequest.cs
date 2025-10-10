namespace Application.Models.Requests
{
    public class RegisterPatientRequest
    {
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Dni { get; set; } = null!;
        public DateOnly? BirthDate { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }
        public string? City { get; set; }
        public string? MembershipNumber { get; set; }
        public int? HealthPlanId { get; set; }
    }
}
