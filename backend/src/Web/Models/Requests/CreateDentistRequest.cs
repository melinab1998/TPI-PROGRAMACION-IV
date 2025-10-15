using System.ComponentModel.DataAnnotations;

namespace Web.Models.Requests;

public record CreateDentistRequest
(
     [Required(ErrorMessage = "El nombre es obligatorio")]
     string FirstName,
     [Required] string LastName,
     [Required] string Email,
     [Required] string LicenseNumber

);

