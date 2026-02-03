package com.unityhospital.patientservice.patient.controller;

import com.unityhospital.patientservice.common.dto.ApiResponse;
import com.unityhospital.patientservice.common.util.PageResponse;
import com.unityhospital.patientservice.patient.dto.*;
import com.unityhospital.patientservice.patient.service.IPatientService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final IPatientService service;

    public PatientController(IPatientService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public ApiResponse<PatientResponseDto> get(@PathVariable UUID id) {
        return ApiResponse.ok(service.getById(id));
    }

    @PostMapping
    public ApiResponse<PatientResponseDto> create(@Valid @RequestBody PatientCreateRequestDto dto) {
        return ApiResponse.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ApiResponse<PatientResponseDto> update(@PathVariable UUID id, @Valid @RequestBody PatientUpdateRequestDto dto) {
        return ApiResponse.ok(service.update(id, dto));
    }

    @PostMapping("/list")
    public ApiResponse<PageResponse<PatientResponseDto>> list(@RequestBody PatientListRequestDto req) {
        return ApiResponse.ok(service.list(req));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Object> deactivate(@PathVariable UUID id) {
        service.deactivate(id);
        return ApiResponse.ok(null);
    }

    @GetMapping("/dropdown")
    public ApiResponse<List<PatientDropdownDto>> dropdown(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean isActive
    ) {
        return ApiResponse.ok(service.dropdown(search, isActive));
    }
}
