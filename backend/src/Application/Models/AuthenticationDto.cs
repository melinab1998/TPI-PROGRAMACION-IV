namespace Application.Models{
    public record AuthenticationDto(
        string Token,
        string Role
    );
}
