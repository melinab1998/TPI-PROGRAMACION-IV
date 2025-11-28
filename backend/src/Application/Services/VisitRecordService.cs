using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;
using System.Text.Json;

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

        public List<VisitRecordDto> GetAllVisitRecord()
        {
            var visitRecords = _visitRecordRepository.List();
            if (!visitRecords.Any())
                return new List<VisitRecordDto>();

            return VisitRecordDto.CreateList(visitRecords);
        }

        public VisitRecordDto GetVisitRecordById(int id)
        {
            var visitRecord = _visitRecordRepository.GetById(id)
                ?? throw new NotFoundException("VISIT_RECORD_NOT_FOUND");

            return VisitRecordDto.Create(visitRecord);
        }

        public VisitRecordDto CreateVisitRecord(CreateVisitRecordRequest request)
        {
            var turn = _turnRepository.GetById(request.TurnId)
                ?? throw new NotFoundException("TURN_NOT_FOUND");

            var odontogramJson = request.OdontogramData is null
                ? null
                : JsonSerializer.Serialize(request.OdontogramData);

            var visitRecord = new VisitRecord(
                request.Treatment,
                request.Diagnosis,
                request.Notes,
                request.Prescription,
                request.TurnId,
                odontogramJson
            );

            _visitRecordRepository.Add(visitRecord);
            return VisitRecordDto.Create(visitRecord);
        }

        public VisitRecordDto UpdateVisitRecord(int id, UpdateVisitRecordRequest request)
        {
            var visitRecord = _visitRecordRepository.GetById(id)
                ?? throw new NotFoundException("VISIT_RECORD_NOT_FOUND");

            var turn = (request.TurnId.HasValue)
                ? _turnRepository.GetById(request.TurnId.Value)
                    ?? throw new NotFoundException("TURN_NOT_FOUND")
                : _turnRepository.GetById(visitRecord.TurnId);

            string? odontogramJson = null;

            if (request.OdontogramData is not null)
            {
                odontogramJson = JsonSerializer.Serialize(request.OdontogramData);
            }

            visitRecord.UpdateInfo(
                request.Treatment,
                request.Diagnosis,
                request.Notes,
                request.Prescription,
                request.TurnId ?? visitRecord.TurnId,
                odontogramJson
            );

            _visitRecordRepository.Update(visitRecord);
            return VisitRecordDto.Create(visitRecord);
        }
    }
}


