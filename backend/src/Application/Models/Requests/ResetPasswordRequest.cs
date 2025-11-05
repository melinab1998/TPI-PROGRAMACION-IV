using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests
{
    public record ResetPasswordRequest(
        [Required(ErrorMessage = "El token es obligatorio")]
        string Token,

        [Required(ErrorMessage = "La nueva contraseña es obligatoria")]
        [MinLength(8, ErrorMessage = "La contraseña debe tener al menos 8 caracteres")]
        [RegularExpression(@"^(?=.*[A-Z]).+$", 
            ErrorMessage = "La contraseña debe contener al menos una mayúscula")]
        string NewPassword
    );
}
