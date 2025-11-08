using Domain.Entities;

namespace Application.Models
{
    public record ContactMessageDto(
    int Id,
    string Name,
    string Email,
    string Message,
    DateTime SentAt
)
    {
        public static ContactMessageDto Create(ContactMessage message)
        {
            return new ContactMessageDto(
                message.Id,
                message.Name,
                message.Email,
                message.Message,
                message.SentAt
            );
        }
        public static List<ContactMessageDto> CreateList(IEnumerable<ContactMessage> messages)
        {
            return messages.Select(Create).ToList();
        }
    }
}
