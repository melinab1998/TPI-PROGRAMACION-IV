using MailKit.Net.Smtp;
using MimeKit;

namespace Application.Interfaces;
public interface IEmailService
    {
        // Ahora recibe el token JWT real, no el ID del dentista
        Task SendActivationEmailAsync(string email, string activationToken);
    }