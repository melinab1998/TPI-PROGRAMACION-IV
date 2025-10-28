using System;
using System.ComponentModel.DataAnnotations;
using Domain.Enums;

namespace Application.Models.Requests
{
    public record CreateTurnRequest
    (
        [Required(ErrorMessage = "La fecha del turno es obligatoria")]
        [DataType(DataType.DateTime)]
        DateTime AppointmentDate,

        [Required(ErrorMessage = "El estado es obligatorio")]
        [EnumDataType(typeof(TurnStatus), ErrorMessage = "El estado del turno no es válido")]
        TurnStatus Status,

        [Required(ErrorMessage = "El tipo de consulta es obligatorio")]
        [EnumDataType(typeof(ConsultationType), ErrorMessage = "El tipo de consulta debe ser 'Consulta' o 'Tratamiento'")]
        ConsultationType ConsultationType,

        [Required(ErrorMessage = "Debe especificarse el paciente")]
        [Range(1, int.MaxValue, ErrorMessage = "El ID del paciente debe ser válido")]
        int PatientId,

        [Required(ErrorMessage = "Debe especificarse el dentista")]
        [Range(1, int.MaxValue, ErrorMessage = "El ID del dentista debe ser válido")]
        int DentistId
    );
}
