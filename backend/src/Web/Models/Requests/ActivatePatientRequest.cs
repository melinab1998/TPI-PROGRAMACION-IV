using System.ComponentModel.DataAnnotations;

namespace Web.Models.Requests
{
    public record ActivatePatientRequest
    (
        [Required(ErrorMessage = "El token es requerido")]
        string Token,
        [Required(ErrorMessage = "La contraseña es requerida")]
        [RegularExpression(@"^(?=.*[A-Z]).{8,}$", ErrorMessage = "La contraseña debe tener al menos 8 caracteres y una letra mayúscula")]
        string Password
    );
}