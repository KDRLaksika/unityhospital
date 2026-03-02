package com.unityhospital.pharmacyservice.masterdata.drug.service;

import com.unityhospital.pharmacyservice.common.exception.NotFoundException;
import com.unityhospital.pharmacyservice.common.util.PageResponse;
import com.unityhospital.pharmacyservice.masterdata.drug.dto.*;
import com.unityhospital.pharmacyservice.masterdata.drug.entity.Drug;
import com.unityhospital.pharmacyservice.masterdata.drug.mapper.DrugMapper;
import com.unityhospital.pharmacyservice.masterdata.drug.repository.IDrugRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class DrugService implements IDrugService {

    private final IDrugRepository repo;

    public DrugService(IDrugRepository repo) {
        this.repo = repo;
    }

    @Transactional(readOnly = true)
    @Override
    public DrugResponseDto getById(UUID id) {
        var e = repo.findById(id).orElseThrow(() -> new NotFoundException("Drug not found: " + id));
        return DrugMapper.toDto(e);
    }

    @Transactional
    @Override
    public DrugResponseDto create(DrugCreateRequestDto dto) {
        var e = new Drug();
        DrugMapper.applyCreate(e, dto);
        e.setActive(true);
        return DrugMapper.toDto(repo.save(e));
    }

    @Transactional
    @Override
    public DrugResponseDto update(UUID id, DrugUpdateRequestDto dto) {
        var e = repo.findById(id).orElseThrow(() -> new NotFoundException("Drug not found: " + id));
        DrugMapper.applyUpdate(e, dto);
        return DrugMapper.toDto(repo.save(e));
    }

    @Transactional
    @Override
    public void softDelete(UUID id) {
        var e = repo.findById(id).orElseThrow(() -> new NotFoundException("Drug not found: " + id));
        e.setActive(false);
        repo.save(e);
    }

    @Transactional(readOnly = true)
    @Override
    public PageResponse<DrugResponseDto> list(DrugListRequestDto req) {
        int page = Math.max(req.page, 1);
        int size = Math.min(Math.max(req.size, 1), 100);

        String sortBy = (req.sortBy == null || req.sortBy.isBlank()) ? "createdAt" : req.sortBy;
        String sortDir = (req.sortDir == null || req.sortDir.isBlank()) ? "desc" : req.sortDir;

        if (req.isActive == null)
            req.isActive = true;

        if (!List.of("name", "createdAt").contains(sortBy))
            sortBy = "createdAt";

        Sort sort = "asc".equalsIgnoreCase(sortDir)
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page - 1, size, sort);

        var result = repo.searchPage(req.search, req.isActive, pageable);
        var items = result.getContent().stream().map(DrugMapper::toDto).toList();

        return PageResponse.of(items, page, size, result.getTotalElements(), result.getTotalPages());
    }

    @Transactional(readOnly = true)
    @Override
    public List<DrugDropdownDto> dropdown(String search) {
        return repo.dropdown(search).stream()
                .map(DrugMapper::toDropdown)
                .toList();
    }
}