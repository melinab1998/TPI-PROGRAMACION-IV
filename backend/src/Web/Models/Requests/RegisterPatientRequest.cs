using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace Web.Models.Requests;

   public record RegisterPatientRequest
    (
        [Required(ErrorMessage = "El nombre es requerido")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "El nombre debe tener entre 2 y 50 caracteres")]
         string FirstName,

        [Required(ErrorMessage = "El apellido es requerido")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "El apellido debe tener entre 2 y 50 caracteres")]
         string LastName,

        [Required(ErrorMessage = "El email es requerido")]
        [EmailAddress(ErrorMessage = "Ingrese un email válido")]
         string Email,

         [Required(ErrorMessage = "La contraseña es requerida")]
         [RegularExpression(@"^(?=.*[A-Z]).{8,}$", ErrorMessage = "La contraseña debe tener al menos 8 caracteres y una letra mayúscula")]
         string Password,

        [Required(ErrorMessage = "El DNI es requerido")]
        [RegularExpression(@"^\d{7,9}$", ErrorMessage = "El DNI debe contener solo números y tener entre 7 y 9 dígitos")]
         string Dni
    );



 /* [CustomBirthDateValidation(ErrorMessage = "La fecha de nacimiento no es válida")]
         DateOnly? BirthDate ,

        [StringLength(100, ErrorMessage = "La dirección no puede exceder 100 caracteres")]
         string? Address ,

        [StringLength(50, ErrorMessage = "La ciudad no puede exceder 50 caracteres")]
         string? City ,

        [StringLength(20, ErrorMessage = "El número de afiliado no puede exceder 20 caracteres")]
         string? MembershipNumber ,

         int? HealthPlanId ,

        [CustomPhoneValidation(ErrorMessage = "El teléfono no es válido")]
         string? PhoneNumber
// Validación personalizada para fecha de nacimiento
class CustomBirthDateValidation : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is null) return ValidationResult.Success;

        if (value is DateOnly date)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            var minDate = today.AddYears(-150);
            if (date > today) return new ValidationResult("La fecha no puede ser futura");
            if (date < minDate) return new ValidationResult("La fecha no es válida");
            return ValidationResult.Success;
        }

        return new ValidationResult("Formato de fecha inválido");
    }
}

    // Validación personalizada para teléfono
     class CustomPhoneValidation : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value is null) return ValidationResult.Success;

            var phone = value as string;
            if (phone == null) return ValidationResult.Success;

            var digits = Regex.Replace(phone, @"\D", "");
            if (digits.Length < 8) return new ValidationResult("Debe tener al menos 8 dígitos");
            if (!Regex.IsMatch(phone, @"^[\d\s+\-()]*$")) return new ValidationResult("El teléfono contiene caracteres inválidos");

            return ValidationResult.Success;
        }
    }

 */