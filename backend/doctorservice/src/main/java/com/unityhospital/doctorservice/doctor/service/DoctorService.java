package com.unityhospital.doctorservice.doctor.service;

import com.unityhospital.doctorservice.common.exception.NotFoundException;
import com.unityhospital.doctorservice.common.util.PageResponse;
import com.unityhospital.doctorservice.doctor.dto.*;
import com.unityhospital.doctorservice.doctor.entity.Doctor;
import com.unityhospital.doctorservice.doctor.mapper.DoctorMapper;
import com.unityhospital.doctorservice.doctor.repository.IDoctorRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class DoctorService implements IDoctorService {

    private final IDoctorRepository repo;

    public DoctorService(IDoctorRepository repo) {
        this.repo = repo;
    }

    @Transactional(readOnly = true)
    @Override
    public DoctorResponseDto getById(UUID id) {
        var d = repo.findById(id).orElseThrow(() -> new NotFoundException("Doctor not found: " + id));
        return DoctorMapper.toDto(d);
    }

    @Transactional
    @Override
    public DoctorResponseDto create(DoctorCreateRequestDto dto) {
        var d = new Doctor();
        DoctorMapper.applyCreate(d, dto);
        d.setActive(true);
        if (dto.isAvailable == null) d.setAvailable(true);
        return DoctorMapper.toDto(repo.save(d));
    }

    @Transactional
    @Override
    public DoctorResponseDto update(UUID id, DoctorUpdateRequestDto dto) {
        var d = repo.findById(id).orElseThrow(() -> new NotFoundException("Doctor not found: " + id));
        DoctorMapper.applyUpdate(d, dto);
        return DoctorMapper.toDto(repo.save(d));
    }

    @Transactional
    @Override
    public void softDelete(UUID id) {
        var d = repo.findById(id).orElseThrow(() -> new NotFoundException("Doctor not found: " + id));
        d.setActive(false);
        repo.save(d);
    }

    @Transactional(readOnly = true)
    @Override
    public PageResponse<DoctorResponseDto> list(DoctorListRequestDto req) {
        int page = Math.max(req.page, 1);
        int size = Math.min(Math.max(req.size, 1), 100);

        String sortBy = (req.sortBy == null || req.sortBy.isBlank()) ? "createdAt" : req.sortBy;
        String sortDir = (req.sortDir == null || req.sortDir.isBlank()) ? "desc" : req.sortDir;

        // allow only these to avoid errors
        if (!List.of("fullName", "speciality", "createdAt").contains(sortBy)) sortBy = "createdAt";

        Sort sort = "asc".equalsIgnoreCase(sortDir)
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page - 1, size, sort);

        var result = repo.searchPage(req.search, req.isActive, pageable);

        var items = result.getContent().stream().map(DoctorMapper::toDto).toList();
        return PageResponse.of(items, page, size, result.getTotalElements(), result.getTotalPages());
    }

    @Transactional(readOnly = true)
    @Override
    public List<DoctorDropdownDto> dropdown(String search) {
        return repo.dropdown(search).stream().map(DoctorMapper::toDropdown).toList();
    }
}
