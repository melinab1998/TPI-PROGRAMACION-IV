using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Configuration;
using Application.Interfaces;

namespace Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public void SendActivationEmail(string email, int dentistId)
    {
        var activationLink = $"{_config["App:FrontendUrl"]}/activate-dentist?token={GenerateToken(dentistId)}";

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("SuperAdmin", _config["Email:From"]!));
        message.To.Add(MailboxAddress.Parse(email));
        message.Subject = "Crea tu contraseña";
        message.Body = new TextPart("html")
        {
            Text = $"Hola, <br> Hacé click en el link para crear tu contraseña: <a href='{activationLink}'>Activar cuenta</a>"
        };

        using var client = new SmtpClient();

        var smtpServer = _config["Email:SmtpServer"];
        var portString = _config["Email:Port"];
        if (string.IsNullOrEmpty(smtpServer) || string.IsNullOrEmpty(portString))
            throw new Exception("SMTP no configurado correctamente.");

        if (!int.TryParse(portString, out var port))
            throw new Exception("Puerto SMTP inválido.");

        client.Connect(smtpServer, port, true);
        client.Authenticate(_config["Email:User"]!, _config["Email:Password"]!);
        client.Send(message);
        client.Disconnect(true);
    }

    private string GenerateToken(int dentistId) => Guid.NewGuid().ToString();
}
