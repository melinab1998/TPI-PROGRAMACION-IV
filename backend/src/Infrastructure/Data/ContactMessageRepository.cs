using Domain.Entities;
using Domain.Interfaces;

namespace Infrastructure.Data
{
    public class ContactMessageRepository : Repository<ContactMessage>, IContactMessageRepository
    {
        public ContactMessageRepository(ApplicationDbContext context) : base(context) { }
    }
}
