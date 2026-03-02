package com.unityhospital.doctorservice.doctor.controller;

import com.unityhospital.doctorservice.common.dto.ApiResponse;
import com.unityhospital.doctorservice.common.util.PageResponse;
import com.unityhospital.doctorservice.doctor.dto.*;
import com.unityhospital.doctorservice.doctor.service.IDoctorService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final IDoctorService service;

    public DoctorController(IDoctorService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public ApiResponse<DoctorResponseDto> getById(@PathVariable UUID id) {
        return ApiResponse.ok(service.getById(id));
    }

    @PostMapping
    public ApiResponse<DoctorResponseDto> create(@Valid @RequestBody DoctorCreateRequestDto dto) {
        return ApiResponse.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ApiResponse<DoctorResponseDto> update(@PathVariable UUID id,
            @Valid @RequestBody DoctorUpdateRequestDto dto) {
        return ApiResponse.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Object> delete(@PathVariable UUID id) {
        service.softDelete(id);
        return ApiResponse.ok(null);
    }

    @PostMapping("/list")
    public ApiResponse<PageResponse<DoctorResponseDto>> list(@RequestBody DoctorListRequestDto req) {
        return ApiResponse.ok(service.list(req));
    }

    @GetMapping("/dropdown")
    public ApiResponse<List<DoctorDropdownDto>> dropdown(
            @RequestParam(required = false) String search) {
        return ApiResponse.ok(service.dropdown(search));
    }
}
