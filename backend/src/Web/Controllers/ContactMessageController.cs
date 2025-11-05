using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace Web.Controllers
{
    [ApiController]
    [Route("api/contact-messages")]
    public class ContactMessageController : ControllerBase
    {
        private readonly IContactMessageService _contactService;

        public ContactMessageController(IContactMessageService contactService)
        {
            _contactService = contactService;
        }

        [HttpGet]
        [Authorize(Roles = "SuperAdmin")]
        public ActionResult<IEnumerable<ContactMessageDto>> GetAll()
        {
            var messages = _contactService.GetAll();
            return Ok(messages);
        }

        [HttpPost]
        public ActionResult<ContactMessageDto> Create([FromBody] ContactMessageRequest request)
        {
            var created = _contactService.Create(request);
            return CreatedAtAction(nameof(Create), new { id = created.Id }, created);
        }
    }
}
