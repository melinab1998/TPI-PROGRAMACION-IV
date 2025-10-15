using System.ComponentModel.DataAnnotations;

namespace Web.Models.Requests;

public record CreateDentistRequest
(
     [Required(ErrorMessage = "El nombre es obligatorio")]
     [MinLength(2, ErrorMessage = "Debe tener al menos 2 caracteres")]
     string FirstName,

     [Required(ErrorMessage = "El apellido es obligatorio")]
     string LastName,
     [Required] string Email,
     [Required] string LicenseNumber

);

