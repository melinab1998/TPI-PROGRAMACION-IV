using MailKit.Net.Smtp;
using MimeKit;

namespace Application.Interfaces;
public interface IEmailService
    {
        Task SendActivationEmailAsync(string email, string activationToken);
    }