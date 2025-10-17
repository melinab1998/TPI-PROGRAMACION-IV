namespace Web.Models.Requests;
using System.ComponentModel.DataAnnotations;
public record UpdateDentistRequest(
    [MinLength(2, ErrorMessage = "Debe tener al menos 2 caracteres")]
    string? FirstName,

    [MinLength(2, ErrorMessage = "Debe tener al menos 2 caracteres")]
    string? LastName,

    [EmailAddress(ErrorMessage = "El formato del email no es válido")]
    string? Email,

    [RegularExpression(@"^MN-\d{3,6}$", ErrorMessage = "Formato inválido. Ej: MN-12345")]
    string? LicenseNumber
);