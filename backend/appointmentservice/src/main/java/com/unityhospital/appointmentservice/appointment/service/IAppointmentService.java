package com.unityhospital.appointmentservice.appointment.service;

import com.unityhospital.appointmentservice.appointment.dto.*;
import com.unityhospital.appointmentservice.common.util.PageResponse;

import java.util.List;
import java.util.UUID;

public interface IAppointmentService {
    AppointmentResponseDto getById(UUID id);
    AppointmentResponseDto create(AppointmentCreateRequestDto dto);
    AppointmentResponseDto update(UUID id, AppointmentUpdateRequestDto dto);
    void softDelete(UUID id);

    PageResponse<AppointmentResponseDto> list(AppointmentListRequestDto req);
    List<AppointmentDropdownDto> dropdown(UUID doctorId, UUID patientId);
}
