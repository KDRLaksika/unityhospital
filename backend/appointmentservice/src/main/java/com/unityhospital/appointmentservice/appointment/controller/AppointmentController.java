package com.unityhospital.appointmentservice.appointment.controller;

import com.unityhospital.appointmentservice.appointment.dto.*;
import com.unityhospital.appointmentservice.appointment.service.IAppointmentService;
import com.unityhospital.appointmentservice.common.dto.ApiResponse;
import com.unityhospital.appointmentservice.common.util.PageResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final IAppointmentService service;

    public AppointmentController(IAppointmentService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public ApiResponse<AppointmentResponseDto> getById(@PathVariable UUID id) {
        return ApiResponse.ok(service.getById(id));
    }

    @PostMapping
    public ApiResponse<AppointmentResponseDto> create(@Valid @RequestBody AppointmentCreateRequestDto dto) {
        return ApiResponse.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ApiResponse<AppointmentResponseDto> update(@PathVariable UUID id, @Valid @RequestBody AppointmentUpdateRequestDto dto) {
        return ApiResponse.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Object> delete(@PathVariable UUID id) {
        service.softDelete(id);
        return ApiResponse.ok(null);
    }

    @PostMapping("/list")
    public ApiResponse<PageResponse<AppointmentResponseDto>> list(@RequestBody AppointmentListRequestDto req) {
        return ApiResponse.ok(service.list(req));
    }

    @GetMapping("/dropdown")
    public ApiResponse<List<AppointmentDropdownDto>> dropdown(
            @RequestParam(required = false) UUID doctorId,
            @RequestParam(required = false) UUID patientId
    ) {
        return ApiResponse.ok(service.dropdown(doctorId, patientId));
    }
}
