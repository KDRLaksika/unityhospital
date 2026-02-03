package com.unityhospital.patientservice.patient.service;

import com.unityhospital.patientservice.patient.dto.*;
import com.unityhospital.patientservice.common.util.PageResponse;

import java.util.List;
import java.util.UUID;

public interface IPatientService {
    PatientResponseDto getById(UUID id);
    PatientResponseDto create(PatientCreateRequestDto dto);
    PatientResponseDto update(UUID id, PatientUpdateRequestDto dto);

    PageResponse<PatientResponseDto> list(PatientListRequestDto req);
    List<PatientDropdownDto> dropdown(String search, Boolean isActive);

    void deactivate(UUID id); // SOFT DELETE
}
