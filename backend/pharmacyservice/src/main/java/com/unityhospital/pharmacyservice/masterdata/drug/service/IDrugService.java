package com.unityhospital.pharmacyservice.masterdata.drug.service;

import com.unityhospital.pharmacyservice.common.util.PageResponse;
import com.unityhospital.pharmacyservice.masterdata.drug.dto.*;

import java.util.List;
import java.util.UUID;

public interface IDrugService {
    DrugResponseDto getById(UUID id);
    DrugResponseDto create(DrugCreateRequestDto dto);
    DrugResponseDto update(UUID id, DrugUpdateRequestDto dto);
    void softDelete(UUID id);

    PageResponse<DrugResponseDto> list(DrugListRequestDto req);
    List<DrugDropdownDto> dropdown(String search);
}