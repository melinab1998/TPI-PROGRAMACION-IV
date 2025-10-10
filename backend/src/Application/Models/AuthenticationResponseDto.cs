namespace Application.Models
{
    public class AuthenticationResponseDto
    {
        public string Token { get; set; } = null!;
        public string Role { get; set; } = null!;
    }
}
