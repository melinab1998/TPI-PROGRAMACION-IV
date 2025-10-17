using System.ComponentModel.DataAnnotations;

namespace Web.Models.Requests
{
    public record UpdatePatientRequest
    (
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Debe tener entre 2 y 50 caracteres")]
        string? FirstName,

        [StringLength(50, MinimumLength = 2, ErrorMessage = "Debe tener entre 2 y 50 caracteres")]
        string? LastName,

        [EmailAddress(ErrorMessage = "Ingrese un email válido")]
        string? Email,

        [RegularExpression(@"^\d{7,9}$", ErrorMessage = "El DNI debe contener solo números y tener entre 7 y 9 dígitos")]
        string? Dni,

        [DataType(DataType.Date, ErrorMessage = "Formato de fecha inválido")]
        DateOnly? BirthDate,

        [StringLength(100, ErrorMessage = "No puede exceder 100 caracteres")]
        string? Address,

        [RegularExpression(@"^[\d\s+\-()]+$", ErrorMessage = "El teléfono contiene caracteres inválidos")]
        string? PhoneNumber,

        [StringLength(50, ErrorMessage = "No puede exceder 50 caracteres")]
        string? City,

        [StringLength(20, ErrorMessage = "No puede exceder 20 caracteres")]
        string? MembershipNumber,

        int? HealthPlanId
    );
}
