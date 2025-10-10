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

        // ✅ Ahora recibe el token JWT generado en AutenticacionService
        public async Task SendActivationEmailAsync(string email, string activationToken)
        {
            try
            {
                Console.WriteLine("=== 🔍 INICIANDO ENVÍO DE EMAIL ===");
                Console.WriteLine($"📧 Para: {email}");
                Console.WriteLine($"🔗 Token: {activationToken.Substring(0, 20)}...");

                // URL al front con token y modo activación
                var activationLink = $"{_config["App:FrontendUrl"]}/reset-password?token={activationToken}";
                Console.WriteLine($"🔗 Link de activación: {activationLink}");

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("SuperAdmin", _config["Email:From"]!));
                message.To.Add(MailboxAddress.Parse(email));
                message.Subject = "Activá tu cuenta";
                message.Body = new TextPart("html")
                {
                    Text = $@"
                        <p>Hola 👋,</p>
                        <p>Para activar tu cuenta y establecer una contraseña, hacé clic en el siguiente enlace:</p>
                        <p><a href='{activationLink}'>Activar mi cuenta</a></p>
                        <p>Este enlace expirará en 24 horas.</p>
                    "
                };

                using var client = new SmtpClient();

                Console.WriteLine("📡 Conectando a SMTP...");
                await client.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
                Console.WriteLine("✅ Conectado a SMTP");

                // Obtener access token con OAuth2 (Gmail API)
                Console.WriteLine("🔑 Obteniendo Access Token...");
                var accessToken = await GetAccessTokenAsync();

                if (string.IsNullOrEmpty(accessToken))
                    throw new Exception("No se pudo obtener el access token");

                Console.WriteLine("🔐 Autenticando con OAuth2...");
                var oauth2 = new SaslMechanismOAuth2(_config["Email:From"]!, accessToken);
                await client.AuthenticateAsync(oauth2);
                Console.WriteLine("✅ Autenticación OAuth2 exitosa");

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
                    Console.WriteLine($"🔍 Inner Exception: {ex.InnerException.Message}");

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
                    Scopes = new[]
                    {
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
    }
}
