using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests
{
    public record CreateVisitRecordRequest
    (
        [Required(ErrorMessage = "Se debe especificar el tipo de tratamiento")]
        [MinLength(10, ErrorMessage = "Debe tener al menos 10 caracteres")]
        string Treatment,

        [Required(ErrorMessage = "El diagnóstico es obligatorio")]
        [MinLength(10, ErrorMessage = "Debe tener al menos 10 caracteres")]
        string Diagnosis,

        string? Notes,

        string? Prescription,

        [Required(ErrorMessage = "Debe especificarse el turno")]
        [Range(1, int.MaxValue, ErrorMessage = "El ID del turno debe ser válido")]
        int TurnId,

        // NUEVO: odontograma que viene del front como objeto JSON
        object? OdontogramData
    );
}
