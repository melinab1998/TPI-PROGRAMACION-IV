using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace Application.Services
{
    public class ContactMessageService : IContactMessageService
    {
        private readonly IContactMessageRepository _repository;

        public ContactMessageService(IContactMessageRepository repository)
        {
            _repository = repository;
        }

        public ContactMessageDto Create(ContactMessageRequest request)
        {
            var message = new ContactMessage(request.Name, request.Email, request.Message);
            _repository.Add(message);
            return ContactMessageDto.Create(message);
        }

        public IEnumerable<ContactMessageDto> GetAll()
        {
            return _repository.List().Select(ContactMessageDto.Create);
        }
    }
}
