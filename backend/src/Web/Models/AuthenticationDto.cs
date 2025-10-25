namespace Web.Models.Responses
{
    public record AuthenticationDto(
        string Token,
        string Role
    );
}
