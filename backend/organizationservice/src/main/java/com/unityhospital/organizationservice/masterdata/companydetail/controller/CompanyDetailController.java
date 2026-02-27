package com.unityhospital.organizationservice.masterdata.companydetail.controller;

import com.unityhospital.organizationservice.common.dto.ApiResponse;
import com.unityhospital.organizationservice.common.util.PageResponse;
import com.unityhospital.organizationservice.masterdata.companydetail.dto.*;
import com.unityhospital.organizationservice.masterdata.companydetail.service.ICompanyDetailService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/company-details")
public class CompanyDetailController {

    private final ICompanyDetailService service;

    public CompanyDetailController(ICompanyDetailService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public ApiResponse<CompanyDetailResponseDto> get(@PathVariable UUID id) {
        return ApiResponse.ok(service.getById(id));
    }

    @PostMapping
    public ApiResponse<CompanyDetailResponseDto> create(@Valid @RequestBody CompanyDetailCreateRequestDto dto) {
        return ApiResponse.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ApiResponse<CompanyDetailResponseDto> update(@PathVariable UUID id, @Valid @RequestBody CompanyDetailUpdateRequestDto dto) {
        return ApiResponse.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Object> delete(@PathVariable UUID id) {
        service.softDelete(id);
        return ApiResponse.ok(null);
    }

    @PostMapping("/list")
    public ApiResponse<PageResponse<CompanyDetailResponseDto>> list(@RequestBody CompanyDetailListRequestDto req) {
        return ApiResponse.ok(service.list(req));
    }

    @GetMapping("/dropdown")
    public ApiResponse<List<CompanyDetailDropdownDto>> dropdown(@RequestParam(required = false) String search) {
        return ApiResponse.ok(service.dropdown(search));
    }
}