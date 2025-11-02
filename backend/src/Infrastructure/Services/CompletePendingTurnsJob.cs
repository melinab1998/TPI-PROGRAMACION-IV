using Application.Interfaces;
using Domain.Interfaces;
using Domain.Enums;
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
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await MarkPendingTurnsAsCompletedAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error updating pending turns");
                }

                // Cada 10 minutos o el intervalo que quieras
                await Task.Delay(TimeSpan.FromMinutes(10), stoppingToken);
            }
        }

        private async Task MarkPendingTurnsAsCompletedAsync()
        {
            using var scope = _scopeFactory.CreateScope();

            var turnService = scope.ServiceProvider.GetRequiredService<ITurnService>();

            var pendingTurns = turnService.GetAllTurns()
                .Where(t => t.Status == TurnStatus.Pending && t.AppointmentDate <= DateTime.Now)
                .ToList();

            foreach (var turn in pendingTurns)
            {
                turn.Status = TurnStatus.Completed;
                turnService.UpdateTurn(turn.Id, new Application.Models.Requests.UpdateTurnRequest
                {
                    Status = TurnStatus.Completed
                });

                _logger.LogInformation($"Turno {turn.Id} marcado como Completed automáticamente.");
            }
        }
    }
}
