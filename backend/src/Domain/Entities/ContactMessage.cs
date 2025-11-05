using Domain.Exceptions;

namespace Domain.Entities
{
    public class ContactMessage
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Message { get; set; }
        public DateTime SentAt { get; set; }

        protected ContactMessage() { }

        public ContactMessage(string name, string email, string message)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new AppValidationException("El nombre es obligatorio.");

            if (string.IsNullOrWhiteSpace(email))
                throw new AppValidationException("El email es obligatorio.");

            if (string.IsNullOrWhiteSpace(message))
                throw new AppValidationException("El mensaje es obligatorio.");

            if (message.Length < 10)
                throw new AppValidationException("El mensaje debe tener al menos 10 caracteres.");

            Name = name.Trim();
            Email = email.Trim();
            Message = message.Trim();
            SentAt = DateTime.UtcNow;
        }
    }
}
