using MailKit.Net.Smtp;
using MimeKit;

namespace Application.Interfaces;
public interface IEmailService
{
    void SendActivationEmail(string email, int dentistId);
}