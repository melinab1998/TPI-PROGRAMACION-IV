using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests;

public record CreateDentistRequest
(
     [Required(ErrorMessage = "El nombre es obligatorio")]
     [MinLength(2, ErrorMessage = "Debe tener al menos 2 caracteres")]
     string FirstName,

     [Required(ErrorMessage = "El apellido es obligatorio")]
     [MinLength(2, ErrorMessage = "Debe tener al menos 2 caracteres")]
     string LastName,

     [Required(ErrorMessage = "El email es obligatorio")]
     [EmailAddress(ErrorMessage = "El formato del email no es válido")]
     string Email,

     [Required(ErrorMessage = "La matrícula es obligatoria")]
     [RegularExpression(@"^MN-\d{3,6}$", ErrorMessage = "Formato inválido. Ej: MN-12345")]
     string LicenseNumber

);

