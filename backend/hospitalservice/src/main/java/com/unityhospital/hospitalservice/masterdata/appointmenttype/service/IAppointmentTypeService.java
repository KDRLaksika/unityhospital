package com.unityhospital.hospitalservice.masterdata.appointmenttype.service;

import com.unityhospital.hospitalservice.common.util.PageResponse;
import com.unityhospital.hospitalservice.masterdata.appointmenttype.dto.*;

import java.util.List;
import java.util.UUID;

public interface IAppointmentTypeService {
    AppointmentTypeResponseDto getById(UUID id);
    AppointmentTypeResponseDto create(AppointmentTypeCreateRequestDto dto);
    AppointmentTypeResponseDto update(UUID id, AppointmentTypeUpdateRequestDto dto);
    void softDelete(UUID id);

    PageResponse<AppointmentTypeResponseDto> list(AppointmentTypeListRequestDto req);
    List<AppointmentTypeDropdownDto> dropdown(String search);
}
