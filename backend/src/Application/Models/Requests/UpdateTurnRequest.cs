using System;
using System.ComponentModel.DataAnnotations;
using Domain.Enums;

namespace Application.Models.Requests
{
    public class UpdateTurnRequest
    {
        [DataType(DataType.DateTime, ErrorMessage = "El formato de la fecha es inválido")]
        public DateTime? AppointmentDate { get; set; }

        [StringLength(100, ErrorMessage = "El tipo de consulta no debe superar los 100 caracteres")]
        public string? ConsultationType { get; set; }

        [EnumDataType(typeof(TurnStatus), ErrorMessage = "El estado del turno no es válido")]
        public TurnStatus? Status { get; set; }
    }
}
