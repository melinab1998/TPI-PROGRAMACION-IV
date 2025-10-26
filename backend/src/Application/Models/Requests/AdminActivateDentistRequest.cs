using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests
{
    public record AdminActivateDentistRequest
    {
        [Required(ErrorMessage = "El estado es obligatorio")]
        public bool? IsActive { get; init; }
    }
}