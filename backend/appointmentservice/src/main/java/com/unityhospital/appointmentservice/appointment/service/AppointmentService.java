package com.unityhospital.appointmentservice.appointment.service;

import com.unityhospital.appointmentservice.appointment.dto.*;
import com.unityhospital.appointmentservice.appointment.entity.Appointment;
import com.unityhospital.appointmentservice.appointment.mapper.AppointmentMapper;
import com.unityhospital.appointmentservice.appointment.repository.IAppointmentRepository;
import com.unityhospital.appointmentservice.common.exception.NotFoundException;
import com.unityhospital.appointmentservice.common.util.PageResponse;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class AppointmentService implements IAppointmentService {

    private final IAppointmentRepository repo;

    public AppointmentService(IAppointmentRepository repo) {
        this.repo = repo;
    }

    @Transactional(readOnly = true)
    @Override
    public AppointmentResponseDto getById(UUID id) {
        var a = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Appointment not found: " + id));
        return AppointmentMapper.toDto(a);
    }

    @Transactional
    @Override
    public AppointmentResponseDto create(AppointmentCreateRequestDto dto) {
        var a = new Appointment();
        AppointmentMapper.applyCreate(a, dto);
        a.setActive(true);
        return AppointmentMapper.toDto(repo.save(a));
    }

    @Transactional
    @Override
    public AppointmentResponseDto update(UUID id, AppointmentUpdateRequestDto dto) {
        var a = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Appointment not found: " + id));

        AppointmentMapper.applyUpdate(a, dto);
        return AppointmentMapper.toDto(repo.save(a));
    }

    @Transactional
    @Override
    public void softDelete(UUID id) {
        var a = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Appointment not found: " + id));
        a.setActive(false);
        repo.save(a);
    }

    @Transactional(readOnly = true)
    @Override
    public PageResponse<AppointmentResponseDto> list(AppointmentListRequestDto req) {

        // ✅ Never allow null search (and keep it lowercase for LIKE)
        String search = (req.search == null) ? "" : req.search.trim().toLowerCase();

        int page = Math.max(req.page, 1);
        int size = Math.min(Math.max(req.size, 1), 100);

        String sortBy = (req.sortBy == null || req.sortBy.isBlank()) ? "createdAt" : req.sortBy;
        String sortDir = (req.sortDir == null || req.sortDir.isBlank()) ? "desc" : req.sortDir;

        // allow only safe sortable fields
        if (!List.of("appointmentDate", "createdAt").contains(sortBy)) sortBy = "createdAt";

        Sort sort = "asc".equalsIgnoreCase(sortDir)
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page - 1, size, sort);

        Specification<Appointment> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (req.isActive != null) {
                predicates.add(cb.equal(root.get("isActive"), req.isActive));
            }

            if (req.patientId != null) {
                predicates.add(cb.equal(root.get("patientId"), req.patientId));
            }

            if (req.doctorId != null) {
                predicates.add(cb.equal(root.get("doctorId"), req.doctorId));
            }

            if (req.status != null) {
                predicates.add(cb.equal(root.get("status"), req.status));
            }

            if (req.fromDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("appointmentDate"), req.fromDate));
            }

            if (req.toDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("appointmentDate"), req.toDate));
            }

            if (!search.isBlank()) {
                // note can be null -> coalesce(note, '')
                var noteExpr = cb.lower(cb.coalesce(root.get("note"), ""));
                predicates.add(cb.like(noteExpr, "%" + search + "%"));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Appointment> pageResult = repo.findAll(spec, pageable);

        var items = pageResult.getContent().stream()
                .map(AppointmentMapper::toDto)
                .toList();

        return PageResponse.of(items, page, size, pageResult.getTotalElements(), pageResult.getTotalPages());
    }

    @Transactional(readOnly = true)
    @Override
    public List<AppointmentDropdownDto> dropdown(UUID doctorId, UUID patientId) {

        // ✅ lightweight dropdown using specification + sorting by date/time desc
        Specification<Appointment> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("isActive"), true));

            if (doctorId != null) {
                predicates.add(cb.equal(root.get("doctorId"), doctorId));
            }

            if (patientId != null) {
                predicates.add(cb.equal(root.get("patientId"), patientId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        // Sort latest first
        Sort sort = Sort.by(Sort.Order.desc("appointmentDate"), Sort.Order.desc("appointmentTime"));

        return repo.findAll(spec, sort).stream()
                .map(AppointmentMapper::toDropdown)
                .toList();
    }
}
