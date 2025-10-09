namespace Application.Models.Requests;
public class ActivateDentistRequest
{
    public string Token { get; set; } = null!;
    public string Password { get; set; } = null!;
}
