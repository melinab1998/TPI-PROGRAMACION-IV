namespace Web.Models.Responses
{
    public record AuthenticationResponseDto(
        string Token,
        string Role
    );
}
