using MailKit.Net.Smtp;
using MimeKit;

namespace Application.Interfaces;

public interface IEmailService
{
    Task SendActivationEmailAsync(string email, string activationToken);
    Task SendAppointmentReminderAsync(string toEmail, string patientName, string dentistName, DateTime appointmentDate, string address);

}