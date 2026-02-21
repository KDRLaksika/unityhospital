package com.unityhospital.hospitalservice.masterdata.appointmenttype.controller;

import com.unityhospital.hospitalservice.common.dto.ApiResponse;
import com.unityhospital.hospitalservice.common.util.PageResponse;
import com.unityhospital.hospitalservice.masterdata.appointmenttype.dto.*;
import com.unityhospital.hospitalservice.masterdata.appointmenttype.service.IAppointmentTypeService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/appointment-types")
public class AppointmentTypeController {

    private final IAppointmentTypeService service;

    public AppointmentTypeController(IAppointmentTypeService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public ApiResponse<AppointmentTypeResponseDto> get(@PathVariable UUID id) {
        return ApiResponse.ok(service.getById(id));
    }

    @PostMapping
    public ApiResponse<AppointmentTypeResponseDto> create(@Valid @RequestBody AppointmentTypeCreateRequestDto dto) {
        return ApiResponse.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ApiResponse<AppointmentTypeResponseDto> update(@PathVariable UUID id,
                                                          @Valid @RequestBody AppointmentTypeUpdateRequestDto dto) {
        return ApiResponse.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Object> delete(@PathVariable UUID id) {
        service.softDelete(id);
        return ApiResponse.ok(null);
    }

    @PostMapping("/list")
    public ApiResponse<PageResponse<AppointmentTypeResponseDto>> list(@RequestBody AppointmentTypeListRequestDto req) {
        return ApiResponse.ok(service.list(req));
    }

    @GetMapping("/dropdown")
    public ApiResponse<List<AppointmentTypeDropdownDto>> dropdown(@RequestParam(required = false) String search) {
        return ApiResponse.ok(service.dropdown(search));
    }
}
