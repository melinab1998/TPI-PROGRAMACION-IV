using Domain.Entities;

namespace Application.Models
{
    public class ContactMessageDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Message { get; set; }
        public DateTime SentAt { get; set; }

        public static ContactMessageDto Create(ContactMessage message)
        {
            return new ContactMessageDto
            {
                Id = message.Id,
                Name = message.Name,
                Email = message.Email,
                Message = message.Message,
                SentAt = message.SentAt
            };
        }
    }
}
