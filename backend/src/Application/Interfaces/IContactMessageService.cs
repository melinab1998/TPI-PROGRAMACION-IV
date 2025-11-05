using Application.Models;
using Application.Models.Requests;
using System.Collections.Generic;

namespace Application.Interfaces
{
    public interface IContactMessageService
    {
        ContactMessageDto Create(ContactMessageRequest request);
        IEnumerable<ContactMessageDto> GetAll();
    }
}
