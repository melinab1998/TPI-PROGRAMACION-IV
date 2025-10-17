using System.ComponentModel.DataAnnotations;

namespace Web.Models.Requests
{
    public record AdminActivateDentistRequest
    {
        [Required(ErrorMessage = "El estado es obligatorio")]
        public bool? IsActive { get; init; }
    }
}