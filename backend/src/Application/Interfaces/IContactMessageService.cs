using Application.Models;
using Application.Models.Requests;

namespace Application.Interfaces
{
    public interface IContactMessageService
    {
        ContactMessageDto Create(ContactMessageRequest request);
        IEnumerable<ContactMessageDto> GetAll();
    }
}
