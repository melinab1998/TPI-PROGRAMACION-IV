using Application.Interfaces;
using Domain.Enums;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class CompletePendingTurnsJob : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<CompletePendingTurnsJob> _logger;

        public CompletePendingTurnsJob(IServiceScopeFactory scopeFactory, ILogger<CompletePendingTurnsJob> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("CompletePendingTurnsJob iniciado a las {Time}", DateTime.Now);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    _logger.LogInformation("Chequeando turns pendientes a las {Time}", DateTime.Now);
                    MarkPendingTurnsAsCompleted();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error al actualizar turns pendientes");
                }

                // Espera un minuto antes del próximo chequeo
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }

        private void MarkPendingTurnsAsCompleted()
        {
            using var scope = _scopeFactory.CreateScope();
            var turnService = scope.ServiceProvider.GetRequiredService<ITurnService>();

            var allTurns = turnService.GetAllTurns(); // Lista completa

            // Usa DateTime.Now si tus fechas están en horario local
            var now = DateTime.Now;

            var pendingTurns = allTurns
                .Where(t => t.Status == TurnStatus.Pending && t.AppointmentDate <= now)
                .ToList();

            _logger.LogInformation("Turns pendientes encontrados: {Count}", pendingTurns.Count);

            foreach (var turn in pendingTurns)
            {
                _logger.LogInformation("Marcando turno {Id} de {AppointmentDate} como Completed", turn.Id, turn.AppointmentDate);

                turn.Status = TurnStatus.Completed;

                // Actualiza el turno en la base
                turnService.UpdateTurn(turn.Id, new Application.Models.Requests.UpdateTurnRequest
                {
                    Status = TurnStatus.Completed
                });

                _logger.LogInformation("Turno {Id} actualizado correctamente", turn.Id);
            }
        }
    }
}

