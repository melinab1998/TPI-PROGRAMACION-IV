using System.ComponentModel.DataAnnotations;

namespace Web.Models.Requests
{
    public record CreatePatientByDentistRequest
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

        [Required(ErrorMessage = "El DNI es requerido")]
        [RegularExpression(@"^\d{7,9}$", ErrorMessage = "El DNI debe contener solo números y tener entre 7 y 9 dígitos")]
        string Dni,

        [StringLength(100, ErrorMessage = "No puede exceder 100 caracteres")]
        string? Address,

        [RegularExpression(@"^[\d\s+\-()]+$", ErrorMessage = "El teléfono contiene caracteres inválidos")]
        string? PhoneNumber,

        [StringLength(50, ErrorMessage = "No puede exceder 50 caracteres")]
        string? City,

        [StringLength(20, ErrorMessage = "No puede exceder 20 caracteres")]
        string? MembershipNumber,

        DateOnly? BirthDate
    );
}
