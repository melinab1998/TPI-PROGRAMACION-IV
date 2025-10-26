using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests;

public record AuthenticationRequest(
    [Required] string Email,
    [Required] string Password
);