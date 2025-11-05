using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests
{
    public class ContactMessageRequest
    {
        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [StringLength(100, ErrorMessage = "El nombre no puede superar los 100 caracteres.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "El email es obligatorio.")]
        [EmailAddress(ErrorMessage = "El email tiene un formato inválido.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "El mensaje es obligatorio.")]
        [MinLength(10, ErrorMessage = "El mensaje debe tener al menos 10 caracteres.")]
        [StringLength(1000, ErrorMessage = "El mensaje no puede superar los 1000 caracteres.")]
        public string Message { get; set; } = string.Empty;
    }
}
