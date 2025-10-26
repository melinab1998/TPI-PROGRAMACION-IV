using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests
{
    public record UpdatePatientEmailRequest(
        [Required(ErrorMessage = "El email es obligatorio")]
        [EmailAddress(ErrorMessage = "Ingrese un email válido")]
        string Email
    );
}
