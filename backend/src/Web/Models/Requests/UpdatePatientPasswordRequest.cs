using System.ComponentModel.DataAnnotations;

namespace Web.Models.Requests
{
    public record UpdatePatientPasswordRequest(
        [Required(ErrorMessage = "La contraseña actual es obligatoria")]
        string CurrentPassword,

        [Required(ErrorMessage = "La nueva contraseña es obligatoria")]
        [MinLength(8, ErrorMessage = "Debe tener al menos 8 caracteres")]
        [RegularExpression(@"^(?=.*[A-Z]).+$", ErrorMessage = "Debe contener al menos una mayúscula")]
        string NewPassword
    );
}