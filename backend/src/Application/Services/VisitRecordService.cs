using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;

namespace Application.Services
{
    public class VisitRecordService : IVisitRecordService
    {
        private readonly IVisitRecordRepository _visitRecordRepository;
        private readonly ITurnRepository _turnRepository;

        public VisitRecordService(
            IVisitRecordRepository visitRecordRepository,
            ITurnRepository turnRepository)
        {
            _visitRecordRepository = visitRecordRepository;
            _turnRepository = turnRepository;
        }

        // Obtener todos los registros de visitas del sistema.
        public List<VisitRecordDto> GetAllVisitRecord()
        {
            var visitRecords = _visitRecordRepository.List();
            if (!visitRecords.Any())
                return new List<VisitRecordDto>();

            return VisitRecordDto.CreateList(visitRecords);
        }

        // Obtener un registro de visita específico por ID.
        public VisitRecordDto GetVisitRecordById(int id)
        {
            var visitRecord = _visitRecordRepository.GetById(id)
                ?? throw new NotFoundException("VISIT_RECORD_NOT_FOUND");

            return VisitRecordDto.Create(visitRecord);
        }

        // Crear un nuevo registro de visita del paciente.
        public VisitRecordDto CreateVisitRecord(CreateVisitRecordRequest request)
        {
            var turn = _turnRepository.GetById(request.TurnId)
                ?? throw new NotFoundException("TURN_NOT_FOUND");

            var visitDate = DateOnly.FromDateTime(turn.AppointmentDate);

            var visitRecord = new VisitRecord(
                visitDate,
                request.Treatment,
                request.Diagnosis,
                request.Notes,
                request.Prescription,
                request.TurnId
            );

            _visitRecordRepository.Add(visitRecord);
            return VisitRecordDto.Create(visitRecord);
        }

        // Actualizar la información de un registro existente.
        public VisitRecordDto UpdateVisitRecord(int id, UpdateVisitRecordRequest request)
        {
            var visitRecord = _visitRecordRepository.GetById(id)
                ?? throw new NotFoundException("VISIT_RECORD_NOT_FOUND");

            var turn = (request.TurnId.HasValue)
                ? _turnRepository.GetById(request.TurnId.Value)
                    ?? throw new NotFoundException("TURN_NOT_FOUND")
                : _turnRepository.GetById(visitRecord.TurnId);

            var visitDate = DateOnly.FromDateTime(turn.AppointmentDate);

            visitRecord.UpdateInfo(
                visitDate,
                request.Treatment,
                request.Diagnosis,
                request.Notes,
                request.Prescription,
                request.TurnId ?? visitRecord.TurnId
            );

            _visitRecordRepository.Update(visitRecord);
            return VisitRecordDto.Create(visitRecord);
        }
    }
}

