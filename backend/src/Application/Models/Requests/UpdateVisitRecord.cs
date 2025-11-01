using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests;

public record UpdateVisitRecordRequest
(
    DateOnly? VisitDate,

    [MinLength(10, ErrorMessage = "Debe tener al menos 10 caracteres")]
    string? Treatment,

    [MinLength(10, ErrorMessage = "Debe tener al menos 10 caracteres")]
    string? Diagnosis,

    string? Notes,

    string? Prescription,

    int? TurnId

);