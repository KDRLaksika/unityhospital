package com.unityhospital.organizationservice.masterdata.companydetail.service;

import com.unityhospital.organizationservice.common.util.PageResponse;
import com.unityhospital.organizationservice.masterdata.companydetail.dto.*;

import java.util.List;
import java.util.UUID;

public interface ICompanyDetailService {
    CompanyDetailResponseDto getById(UUID id);
    CompanyDetailResponseDto create(CompanyDetailCreateRequestDto dto);
    CompanyDetailResponseDto update(UUID id, CompanyDetailUpdateRequestDto dto);
    void softDelete(UUID id);

    PageResponse<CompanyDetailResponseDto> list(CompanyDetailListRequestDto req);
    List<CompanyDetailDropdownDto> dropdown(String search);
}