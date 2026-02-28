package com.unityhospital.doctorservice.doctor.service;

import com.unityhospital.doctorservice.common.util.PageResponse;
import com.unityhospital.doctorservice.doctor.dto.*;

import java.util.List;
import java.util.UUID;

public interface IDoctorService {
    DoctorResponseDto getById(UUID id);
    DoctorResponseDto create(DoctorCreateRequestDto dto);
    DoctorResponseDto update(UUID id, DoctorUpdateRequestDto dto);
    void softDelete(UUID id);

    PageResponse<DoctorResponseDto> list(DoctorListRequestDto req);
    List<DoctorDropdownDto> dropdown(String search);
}
