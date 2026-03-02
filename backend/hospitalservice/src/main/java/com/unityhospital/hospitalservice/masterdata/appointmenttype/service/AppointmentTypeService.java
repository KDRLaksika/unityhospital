package com.unityhospital.hospitalservice.masterdata.appointmenttype.service;

import com.unityhospital.hospitalservice.common.exception.NotFoundException;
import com.unityhospital.hospitalservice.common.util.PageResponse;
import com.unityhospital.hospitalservice.masterdata.appointmenttype.dto.*;
import com.unityhospital.hospitalservice.masterdata.appointmenttype.entity.AppointmentType;
import com.unityhospital.hospitalservice.masterdata.appointmenttype.mapper.AppointmentTypeMapper;
import com.unityhospital.hospitalservice.masterdata.appointmenttype.repository.IAppointmentTypeRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AppointmentTypeService implements IAppointmentTypeService {

    private final IAppointmentTypeRepository repo;

    public AppointmentTypeService(IAppointmentTypeRepository repo) {
        this.repo = repo;
    }

    @Transactional(readOnly = true)
    @Override
    public AppointmentTypeResponseDto getById(UUID id) {
        var e = repo.findById(id).orElseThrow(() -> new NotFoundException("AppointmentType not found: " + id));
        return AppointmentTypeMapper.toDto(e);
    }

    @Transactional
    @Override
    public AppointmentTypeResponseDto create(AppointmentTypeCreateRequestDto dto) {
        var e = new AppointmentType();
        AppointmentTypeMapper.applyCreate(e, dto);
        e.setActive(true);
        return AppointmentTypeMapper.toDto(repo.save(e));
    }

    @Transactional
    @Override
    public AppointmentTypeResponseDto update(UUID id, AppointmentTypeUpdateRequestDto dto) {
        var e = repo.findById(id).orElseThrow(() -> new NotFoundException("AppointmentType not found: " + id));
        AppointmentTypeMapper.applyUpdate(e, dto);
        return AppointmentTypeMapper.toDto(repo.save(e));
    }

    @Transactional
    @Override
    public void softDelete(UUID id) {
        var e = repo.findById(id).orElseThrow(() -> new NotFoundException("AppointmentType not found: " + id));
        e.setActive(false);
        repo.save(e);
    }

    @Transactional(readOnly = true)
    @Override
    public PageResponse<AppointmentTypeResponseDto> list(AppointmentTypeListRequestDto req) {
        int page = Math.max(req.page, 1);
        int size = Math.min(Math.max(req.size, 1), 100);

        if (req.isActive == null)
            req.isActive = true;

        String sortBy = (req.sortBy == null || req.sortBy.isBlank()) ? "createdAt" : req.sortBy;
        String sortDir = (req.sortDir == null || req.sortDir.isBlank()) ? "desc" : req.sortDir;

        if (!List.of("name", "createdAt").contains(sortBy))
            sortBy = "createdAt";

        Sort sort = "asc".equalsIgnoreCase(sortDir)
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page - 1, size, sort);

        var result = repo.searchPage(req.search, req.isActive, pageable);
        var items = result.getContent().stream().map(AppointmentTypeMapper::toDto).toList();
        return PageResponse.of(items, page, size, result.getTotalElements(), result.getTotalPages());
    }

    @Transactional(readOnly = true)
    @Override
    public List<AppointmentTypeDropdownDto> dropdown(String search) {
        return repo.dropdown(search).stream().map(AppointmentTypeMapper::toDropdown).toList();
    }
}
