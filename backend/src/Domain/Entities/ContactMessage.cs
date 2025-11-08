using Domain.Exceptions;

namespace Domain.Entities
{
    public class ContactMessage
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime SentAt { get; set; }

        protected ContactMessage() { }

        public ContactMessage(string name, string email, string message)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new AppValidationException("NAME_REQUIRED");

            if (string.IsNullOrWhiteSpace(email))
                throw new AppValidationException("EMAIL_REQUIRED");

            if (string.IsNullOrWhiteSpace(message))
                throw new AppValidationException("MESSAGE_REQUIRED");

            if (message.Length < 10)
                throw new AppValidationException("MESSAGE_TOO_SHORT");

            Name = name.Trim();
            Email = email.Trim();
            Message = message.Trim();
            SentAt = DateTime.UtcNow;
        }
    }
}

