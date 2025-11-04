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

        //Obtener todos los registros
        public List<VisitRecordDto> GetAllVisitRecord()
        {
            var visitRecords = _visitRecordRepository.List();
            if (!visitRecords.Any())
                return new List<VisitRecordDto>();
            return VisitRecordDto.CreateList(visitRecords);
        }

        //Obtener un registro en particular
        public VisitRecordDto GetVisitRecordById(int id)
        {
            var visitRecord = _visitRecordRepository.GetById(id)
                ?? throw new NotFoundException("VISIT_RECORD_NOT_FOUND");
            return VisitRecordDto.Create(visitRecord);
        }

        //Crear un registro
        public VisitRecordDto CreateVisitRecord(CreateVisitRecordRequest request)
        {
            var turn = _turnRepository.GetById(request.TurnId)
                ?? throw new NotFoundException("TURN_NOT_FOUND");
            var visitRecord = new VisitRecord(
                request.VisitDate,
                request.Treatment,
                request.Diagnosis,
                request.Notes,
                request.Prescription,
                request.TurnId
            );
            _visitRecordRepository.Add(visitRecord);
            return VisitRecordDto.Create(visitRecord);
        }

        //Actualizar un registro
        public VisitRecordDto UpdateVisitRecord(int id, UpdateVisitRecordRequest request)
        {
            var visitRecord = _visitRecordRepository.GetById(id)
                ?? throw new NotFoundException("VISIT_REPOSITORY_NOT_FOUND");
            visitRecord.UpdateInfo(
                request.VisitDate,
                request.Treatment,
                request.Diagnosis,
                request.Notes,
                request.Prescription,
                request.TurnId
            );
            _visitRecordRepository.Update(visitRecord);

            return VisitRecordDto.Create(visitRecord);
        }
    }
}