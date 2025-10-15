using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests;
public record ActivateDentistRequest
(
    [Required]
     string Token,
     [Required]
     string Password

);

