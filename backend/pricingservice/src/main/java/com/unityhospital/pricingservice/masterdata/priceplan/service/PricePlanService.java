package com.unityhospital.pricingservice.masterdata.priceplan.service;

import com.unityhospital.pricingservice.common.exception.NotFoundException;
import com.unityhospital.pricingservice.common.util.PageResponse;
import com.unityhospital.pricingservice.masterdata.priceplan.dto.*;
import com.unityhospital.pricingservice.masterdata.priceplan.entity.PricePlan;
import com.unityhospital.pricingservice.masterdata.priceplan.mapper.PricePlanMapper;
import com.unityhospital.pricingservice.masterdata.priceplan.repository.IPricePlanRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class PricePlanService implements IPricePlanService {

    private final IPricePlanRepository repo;

    public PricePlanService(IPricePlanRepository repo) {
        this.repo = repo;
    }

    @Transactional(readOnly = true)
    @Override
    public PricePlanResponseDto getById(UUID id) {
        var e = repo.findById(id).orElseThrow(() -> new NotFoundException("PricePlan not found: " + id));
        return PricePlanMapper.toDto(e);
    }

    @Transactional
    @Override
    public PricePlanResponseDto create(PricePlanCreateRequestDto dto) {
        var e = new PricePlan();
        PricePlanMapper.applyCreate(e, dto);
        e.setActive(true);
        return PricePlanMapper.toDto(repo.save(e));
    }

    @Transactional
    @Override
    public PricePlanResponseDto update(UUID id, PricePlanUpdateRequestDto dto) {
        var e = repo.findById(id).orElseThrow(() -> new NotFoundException("PricePlan not found: " + id));
        PricePlanMapper.applyUpdate(e, dto);
        return PricePlanMapper.toDto(repo.save(e));
    }

    @Transactional
    @Override
    public void softDelete(UUID id) {
        var e = repo.findById(id).orElseThrow(() -> new NotFoundException("PricePlan not found: " + id));
        e.setActive(false);
        repo.save(e);
    }

    @Transactional(readOnly = true)
    @Override
    public PageResponse<PricePlanResponseDto> list(PricePlanListRequestDto req) {
        int page = Math.max(req.page, 1);
        int size = Math.min(Math.max(req.size, 1), 100);

        String sortBy = (req.sortBy == null || req.sortBy.isBlank()) ? "createdAt" : req.sortBy;
        String sortDir = (req.sortDir == null || req.sortDir.isBlank()) ? "desc" : req.sortDir;

        if (!List.of("name", "amount", "createdAt").contains(sortBy)) sortBy = "createdAt";

        Sort sort = "asc".equalsIgnoreCase(sortDir)
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page - 1, size, sort);

        var result = repo.searchPage(req.search, req.appointmentTypeId, req.isActive, pageable);
        var items = result.getContent().stream().map(PricePlanMapper::toDto).toList();

        return PageResponse.of(items, page, size, result.getTotalElements(), result.getTotalPages());
    }

    @Transactional(readOnly = true)
    @Override
    public List<PricePlanDropdownDto> dropdown(String search, UUID appointmentTypeId) {
        return repo.dropdown(search, appointmentTypeId).stream()
                .map(PricePlanMapper::toDropdown)
                .toList();
    }
}
