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

    // Servicio en segundo plano (BackgroundService) encargado de enviar recordatorios por correo electrónico
    // a los pacientes que tienen turnos pendientes para el día siguiente.

    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<AppointmentReminderJob> _logger;

        public AppointmentReminderJob(IServiceScopeFactory scopeFactory, ILogger<AppointmentReminderJob> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }
        
        // Método principal que ejecuta el servicio en un bucle continuo hasta que se cancele.
        // Se ejecuta una vez cada 24 horas para enviar los recordatorios de los turnos.
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
                    _logger.LogError(ex, "Error al enviar recordatorios de turnos");
                }
                await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
            }
        }

        // Obtiene los turnos pendientes para mañana y envía correos electrónicos a los pacientes correspondientes.
        private async Task SendRemindersAsync()
        {
            using var scope = _scopeFactory.CreateScope();

            var turnService = scope.ServiceProvider.GetRequiredService<ITurnService>();
            var patientRepository = scope.ServiceProvider.GetRequiredService<IPatientRepository>();
            var dentistRepository = scope.ServiceProvider.GetRequiredService<IDentistRepository>();
            var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

            try
            {
                var turns = turnService.GetAllTurns()
                    .Where(t => t.Status == Domain.Enums.TurnStatus.Pending
                    && t.AppointmentDate.Date == DateTime.Today.AddDays(1))
                    .ToList();

                if (!turns.Any())
                {
                    _logger.LogInformation("No hay turnos pendientes para mañana — se omite el envío de recordatorios.");
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

                        _logger.LogInformation($"Recordatorio enviado a {patient.Email} para el turno del {turn.AppointmentDate}");
                    }
                }
            }
            catch (NotFoundException ex)
            {
                _logger.LogWarning("No se encontraron turnos: {Message}", ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error inesperado al enviar recordatorios de turnos");
            }
        }
    }
}

