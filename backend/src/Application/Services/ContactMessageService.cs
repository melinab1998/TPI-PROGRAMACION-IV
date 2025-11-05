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
        private readonly IContactMessageRepository _contactRepository;

        public ContactMessageService(IContactMessageRepository repository)
        {
            _contactRepository = repository;
        }

        // Crea un nuevo mensaje de contacto a partir de la solicitud enviada por el usuario.
        public ContactMessageDto Create(ContactMessageRequest request)
        {
            var message = new ContactMessage(request.Name, request.Email, request.Message);
            _contactRepository.Add(message);
            return ContactMessageDto.Create(message);
        }

        // Obtiene la lista completa de mensajes de contacto almacenados en el sistema.
        public IEnumerable<ContactMessageDto> GetAll()
        {
            return _contactRepository.List().Select(ContactMessageDto.Create);
        }
    }
}
