package com.unityhospital.organizationservice.masterdata.companydetail.service;

import com.unityhospital.organizationservice.common.exception.NotFoundException;
import com.unityhospital.organizationservice.common.util.PageResponse;
import com.unityhospital.organizationservice.masterdata.companydetail.dto.*;
import com.unityhospital.organizationservice.masterdata.companydetail.entity.CompanyDetail;
import com.unityhospital.organizationservice.masterdata.companydetail.mapper.CompanyDetailMapper;
import com.unityhospital.organizationservice.masterdata.companydetail.repository.ICompanyDetailRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CompanyDetailService implements ICompanyDetailService {

    private final ICompanyDetailRepository repo;

    public CompanyDetailService(ICompanyDetailRepository repo) {
        this.repo = repo;
    }

    @Transactional(readOnly = true)
    @Override
    public CompanyDetailResponseDto getById(UUID id) {
        var e = repo.findById(id).orElseThrow(() -> new NotFoundException("CompanyDetail not found: " + id));
        return CompanyDetailMapper.toDto(e);
    }

    @Transactional
    @Override
    public CompanyDetailResponseDto create(CompanyDetailCreateRequestDto dto) {
        var e = new CompanyDetail();
        CompanyDetailMapper.applyCreate(e, dto);
        e.setActive(true);
        return CompanyDetailMapper.toDto(repo.save(e));
    }

    @Transactional
    @Override
    public CompanyDetailResponseDto update(UUID id, CompanyDetailUpdateRequestDto dto) {
        var e = repo.findById(id).orElseThrow(() -> new NotFoundException("CompanyDetail not found: " + id));
        CompanyDetailMapper.applyUpdate(e, dto);
        return CompanyDetailMapper.toDto(repo.save(e));
    }

    @Transactional
    @Override
    public void softDelete(UUID id) {
        var e = repo.findById(id).orElseThrow(() -> new NotFoundException("CompanyDetail not found: " + id));
        e.setActive(false);
        repo.save(e);
    }

    @Transactional(readOnly = true)
    @Override
    public PageResponse<CompanyDetailResponseDto> list(CompanyDetailListRequestDto req) {
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
        var items = result.getContent().stream().map(CompanyDetailMapper::toDto).toList();

        return PageResponse.of(items, page, size, result.getTotalElements(), result.getTotalPages());
    }

    @Transactional(readOnly = true)
    @Override
    public List<CompanyDetailDropdownDto> dropdown(String search) {
        return repo.dropdown(search).stream()
                .map(CompanyDetailMapper::toDropdown)
                .toList();
    }
}