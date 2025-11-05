using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests
{
    public record ForgotPasswordRequest(
        [Required(ErrorMessage = "El correo electrónico es obligatorio")]
        [EmailAddress(ErrorMessage = "Debe ser un correo electrónico válido")]
        string Email
    );
}
