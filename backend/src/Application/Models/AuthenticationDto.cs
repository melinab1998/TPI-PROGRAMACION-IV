namespace Application.Models
{
    public record AuthenticationDto(string Token, string Role)
    {
        public static AuthenticationDto Create(string token, string role)
        {
            return new AuthenticationDto(token, role);
        }

    }

}
