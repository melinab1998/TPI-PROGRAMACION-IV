using Application.Interfaces;
using Domain.Interfaces;
using Domain.Exceptions;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services
{
    public class AppointmentReminderJob : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<AppointmentReminderJob> _logger;

        public AppointmentReminderJob(IServiceScopeFactory scopeFactory, ILogger<AppointmentReminderJob> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await SendRemindersAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error while sending reminders");
                }

                // Para test, podés usar FromMinutes(1) o FromSeconds(30)
                await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
            }
        }

        private async Task SendRemindersAsync()
        {
            using var scope = _scopeFactory.CreateScope();

            var turnService = scope.ServiceProvider.GetRequiredService<ITurnService>();
            var patientRepository = scope.ServiceProvider.GetRequiredService<IPatientRepository>();
            var dentistRepository = scope.ServiceProvider.GetRequiredService<IDentistRepository>();
            var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

            try
            {
                // Solo turnos pendientes para mañana
                var turns = turnService.GetAllTurns()
                    .Where(t => t.Status == Domain.Enums.TurnStatus.Pending
                             && t.AppointmentDate.Date == DateTime.Today.AddDays(1))
                    .ToList();

                if (!turns.Any())
                {
                    _logger.LogInformation("No pending turns for tomorrow — skipping reminder job.");
                    return;
                }

                foreach (var turn in turns)
                {
                    var patient = patientRepository.GetById(turn.PatientId);
                    var dentist = dentistRepository.GetById(turn.DentistId);

                    if (patient != null && dentist != null && !string.IsNullOrEmpty(patient.Email))
                    {
                        await emailService.SendAppointmentReminderAsync(
                            patient.Email,
                            $"{patient.FirstName} {patient.LastName}",
                            $"{dentist.FirstName} {dentist.LastName}",
                            turn.AppointmentDate,
                            "Mitre 959"
                        );

                        _logger.LogInformation($"Reminder sent to {patient.Email} for {turn.AppointmentDate}");
                    }
                }
            }
            catch (NotFoundException ex)
            {
                _logger.LogWarning("No turns found: {Message}", ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while sending appointment reminders");
            }
        }
    }
}
