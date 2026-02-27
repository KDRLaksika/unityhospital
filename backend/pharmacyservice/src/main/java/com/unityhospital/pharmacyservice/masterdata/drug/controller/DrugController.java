package com.unityhospital.pharmacyservice.masterdata.drug.controller;

import com.unityhospital.pharmacyservice.common.dto.ApiResponse;
import com.unityhospital.pharmacyservice.common.util.PageResponse;
import com.unityhospital.pharmacyservice.masterdata.drug.dto.*;
import com.unityhospital.pharmacyservice.masterdata.drug.service.IDrugService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/drugs")
public class DrugController {

    private final IDrugService service;

    public DrugController(IDrugService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public ApiResponse<DrugResponseDto> get(@PathVariable UUID id) {
        return ApiResponse.ok(service.getById(id));
    }

    @PostMapping
    public ApiResponse<DrugResponseDto> create(@Valid @RequestBody DrugCreateRequestDto dto) {
        return ApiResponse.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ApiResponse<DrugResponseDto> update(@PathVariable UUID id, @Valid @RequestBody DrugUpdateRequestDto dto) {
        return ApiResponse.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Object> delete(@PathVariable UUID id) {
        service.softDelete(id);
        return ApiResponse.ok(null);
    }

    @PostMapping("/list")
    public ApiResponse<PageResponse<DrugResponseDto>> list(@RequestBody DrugListRequestDto req) {
        return ApiResponse.ok(service.list(req));
    }

    @GetMapping("/dropdown")
    public ApiResponse<List<DrugDropdownDto>> dropdown(@RequestParam(required = false) String search) {
        return ApiResponse.ok(service.dropdown(search));
    }
}