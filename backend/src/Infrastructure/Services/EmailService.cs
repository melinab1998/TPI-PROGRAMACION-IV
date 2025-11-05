using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Configuration;
using Application.Interfaces;
using MailKit.Security;
using System.Text.Json;

namespace Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        // Servicio encargado del envío de correos electrónicos del sistema.
        // Utiliza Gmail con autenticación OAuth2 mediante access token.
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;

        public EmailService(IConfiguration config, HttpClient httpClient)
        {
            _config = config;
            _httpClient = httpClient;
        }

        // Envía un correo de activación de cuenta al usuario.
        public async Task SendActivationEmailAsync(string email, string activationToken)
        {
            try
            {
                Console.WriteLine("=== INICIANDO ENVÍO DE EMAIL ===");

                var activationLink = $"{_config["App:FrontendUrl"]}/reset-password?token={activationToken}";

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("SuperAdmin", _config["Email:From"]!));
                message.To.Add(MailboxAddress.Parse(email));
                message.Subject = "Activá tu cuenta";
                message.Body = new TextPart("html")
                {
                    Text = $@"
                        <p>Hola 👋,</p>
                        <p>Para activar tu cuenta, hacé clic en el siguiente enlace:</p>
                        <p><a href='{activationLink}'>Activar mi cuenta</a></p>
                        <p>Este enlace expirará en 24 horas.</p>
                    "
                };

                using var client = new SmtpClient();

                Console.WriteLine("Conectando a SMTP...");
                await client.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);

                Console.WriteLine("Obteniendo Access Token (via HttpClient)...");
                var accessToken = await GetAccessTokenAsync();

                if (string.IsNullOrEmpty(accessToken))
                    throw new Exception("No se pudo obtener el access token");

                var oauth2 = new SaslMechanismOAuth2(_config["Email:From"]!, accessToken);
                await client.AuthenticateAsync(oauth2);

                Console.WriteLine("Enviando email...");
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                Console.WriteLine($"Email enviado exitosamente a: {email}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR en SendActivationEmailAsync: {ex.Message}");
                throw;
            }
        }

        // Obtiene el access token de Google OAuth2 mediante el refresh token almacenado en las configuraciones.
        private async Task<string> GetAccessTokenAsync()
        {
            var clientId = _config["Email:ClientId"]!;
            var clientSecret = _config["Email:ClientSecret"]!;
            var refreshToken = _config["Email:RefreshToken"]!;

            var requestData = new Dictionary<string, string>
            {
                ["client_id"] = clientId,
                ["client_secret"] = clientSecret,
                ["refresh_token"] = refreshToken,
                ["grant_type"] = "refresh_token"
            };

            using var content = new FormUrlEncodedContent(requestData);

            var response = await _httpClient.PostAsync("https://oauth2.googleapis.com/token", content);

            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync();
                throw new Exception($"Error al obtener token de Google: {response.StatusCode}, body: {body}");
            }

            var json = await response.Content.ReadAsStringAsync();
            var tokenData = JsonSerializer.Deserialize<JsonElement>(json);

            var accessToken = tokenData.GetProperty("access_token").GetString();

            Console.WriteLine($"Access Token obtenido correctamente (primeros 20 chars): {accessToken?.Substring(0, 20)}...");
            return accessToken!;
        }

        // Envía un recordatorio de turno al paciente con la información del día, hora, profesional y dirección del consultorio.
        public async Task SendAppointmentReminderAsync(string toEmail, string patientName, string dentistName, DateTime appointmentDate, string address)
        {
            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("Consultorio Odontológico", _config["Email:From"]!));
                message.To.Add(MailboxAddress.Parse(toEmail));
                message.Subject = "Recordatorio de turno";

                var fecha = appointmentDate.ToString("dddd dd/MM/yyyy", new System.Globalization.CultureInfo("es-AR"));
                var hora = appointmentDate.ToString("HH:mm");

                message.Body = new TextPart("html")
                {
                    Text = $@"
                <p>Estimado/a {patientName},</p>
                <p>Recuerde concurrir a su cita del día <b>{fecha}</b> a las <b>{hora} hs.</b></p>
                <p><b>Profesional:</b> {dentistName}<br/>
                <b>Lugar de atención:</b> {address}</p>
                <p>Si necesita cancelar su turno, <a href='{_config["App:FrontendUrl"]}/login'>inicie sesión en su cuenta</a> para gestionarlo desde su panel de usuario.</p>
                <p>Muchas gracias,<br/>
                Consultorio Odontológico</p>"
                };

                using var client = new SmtpClient();
                await client.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);

                var accessToken = await GetAccessTokenAsync();
                var oauth2 = new SaslMechanismOAuth2(_config["Email:From"]!, accessToken);

                await client.AuthenticateAsync(oauth2);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                Console.WriteLine($"Recordatorio enviado correctamente a {toEmail}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR al enviar recordatorio: {ex.Message}");
                throw;
            }
        }

        // Envía un correo para restablecer la contraseña del usuario.
        public async Task SendPasswordResetEmailAsync(string toEmail, string resetToken)
        {
            try
            {
                Console.WriteLine("=== INICIANDO ENVÍO DE EMAIL DE RECUPERACIÓN ===");

                var resetLink = $"{_config["App:FrontendUrl"]}/reset-password?token={resetToken}";

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("Consultorio Odontológico", _config["Email:From"]!));
                message.To.Add(MailboxAddress.Parse(toEmail));
                message.Subject = "Recuperación de contraseña";
                message.Body = new TextPart("html")
                {
                    Text = $@"
                <p>Hola 👋,</p>
                <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
                <p>Para continuar, hacé clic en el siguiente enlace:</p>
                <p><a href='{resetLink}'>Restablecer mi contraseña</a></p>
                <p>Este enlace expirará en 1 hora.</p>
                <p>Si no solicitaste esto, ignorá este correo.</p>
                <p>Muchas gracias,<br/>Consultorio Odontológico</p>"
                };

                using var client = new SmtpClient();
                Console.WriteLine("Conectando a SMTP...");
                await client.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);

                var accessToken = await GetAccessTokenAsync();
                if (string.IsNullOrEmpty(accessToken))
                    throw new Exception("No se pudo obtener el access token");

                var oauth2 = new SaslMechanismOAuth2(_config["Email:From"]!, accessToken);
                await client.AuthenticateAsync(oauth2);

                Console.WriteLine("Enviando email...");
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                Console.WriteLine($"Email de recuperación enviado exitosamente a: {toEmail}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR en SendPasswordResetEmailAsync: {ex.Message}");
                throw;
            }
        }
    }
}

