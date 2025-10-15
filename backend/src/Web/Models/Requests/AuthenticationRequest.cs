using System.ComponentModel.DataAnnotations;

namespace Web.Models.Requests;

public record AuthenticationRequest(
    [Required] string Email,
    [Required] string Password
);