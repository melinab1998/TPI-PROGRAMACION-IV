using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace Application.Models.Requests;

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

