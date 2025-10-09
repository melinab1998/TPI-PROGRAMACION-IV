using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Configuration;
using Application.Interfaces;
using MailKit.Security;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendActivationEmailAsync(string email, int dentistId)
{
    try
    {
        Console.WriteLine("=== 🔍 INICIANDO ENVÍO DE EMAIL ===");
        Console.WriteLine($"📧 Para: {email}");
        Console.WriteLine($"🆔 Dentist ID: {dentistId}");

        var activationLink = $"{_config["App:FrontendUrl"]}/activate-dentist?token={GenerateToken(dentistId)}";
        Console.WriteLine($"🔗 Link de activación: {activationLink}");

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("SuperAdmin", _config["Email:From"]!));
        message.To.Add(MailboxAddress.Parse(email));
        message.Subject = "Crea tu contraseña";
        message.Body = new TextPart("html")
        {
            Text = $"Hola, <br> Hacé click en el link para crear tu contraseña: <a href='{activationLink}'>Activar cuenta</a>"
        };

        using var client = new SmtpClient();
        
        Console.WriteLine("📡 Conectando a SMTP...");
        await client.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
        Console.WriteLine("✅ Conectado a SMTP");

        // Obtener access token con más logging
        Console.WriteLine("🔑 Obteniendo Access Token...");
        var accessToken = await GetAccessTokenAsync();
        Console.WriteLine($"✅ Access Token obtenido: {!string.IsNullOrEmpty(accessToken)}");
        
        if (string.IsNullOrEmpty(accessToken))
        {
            throw new Exception("No se pudo obtener el access token");
        }

        Console.WriteLine("🔐 Autenticando con OAuth2...");
        var oauth2 = new SaslMechanismOAuth2(_config["Email:From"]!, accessToken);
        
        try
        {
            await client.AuthenticateAsync(oauth2);
            Console.WriteLine("✅ Autenticación OAuth2 exitosa");
        }
        catch (AuthenticationException authEx)
        {
            Console.WriteLine($"❌ Error de autenticación: {authEx.Message}");
            throw;
        }

        Console.WriteLine("📤 Enviando email...");
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
        
        Console.WriteLine($"✅ Email enviado exitosamente a: {email}");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"💥 ERROR CRÍTICO en SendActivationEmailAsync: {ex.Message}");
        Console.WriteLine($"📖 Stack Trace: {ex.StackTrace}");
        
        if (ex.InnerException != null)
        {
            Console.WriteLine($"🔍 Inner Exception: {ex.InnerException.Message}");
        }
        
        throw;
    }
}

        private async Task<string> GetAccessTokenAsync()
{
    try
    {
        var clientId = _config["Email:ClientId"]!;
        var clientSecret = _config["Email:ClientSecret"]!;
        var refreshToken = _config["Email:RefreshToken"]!;

        Console.WriteLine("=== 🔍 OBTENIENDO ACCESS TOKEN ===");
        Console.WriteLine($"📧 Email From: {_config["Email:From"]}");
        Console.WriteLine($"🔑 ClientId: {clientId?.Substring(0, 10)}...");
        Console.WriteLine($"🔄 RefreshToken: {refreshToken?.Substring(0, 10)}...");

        var tokenResponse = new TokenResponse { RefreshToken = refreshToken };
        var flow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
        {
            ClientSecrets = new ClientSecrets
            {
                ClientId = clientId,
                ClientSecret = clientSecret
            },
            Scopes = new[] { 
                "https://www.googleapis.com/auth/gmail.send",
                "https://www.googleapis.com/auth/userinfo.email"
            }
        });

        var credential = new UserCredential(flow, "user", tokenResponse);
        await credential.RefreshTokenAsync(CancellationToken.None);
        
        var token = credential.Token.AccessToken;
        Console.WriteLine($"✅ Token obtenido: {token?.Substring(0, 30)}...");
        
        return token;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ ERROR en GetAccessTokenAsync: {ex.Message}");
        throw;
    }
}
        private string GenerateToken(int dentistId) => Guid.NewGuid().ToString();
    }
}
