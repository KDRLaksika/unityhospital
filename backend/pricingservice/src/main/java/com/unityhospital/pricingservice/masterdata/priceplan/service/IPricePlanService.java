package com.unityhospital.pricingservice.masterdata.priceplan.service;

import com.unityhospital.pricingservice.common.util.PageResponse;
import com.unityhospital.pricingservice.masterdata.priceplan.dto.*;

import java.util.List;
import java.util.UUID;

public interface IPricePlanService {
    PricePlanResponseDto getById(UUID id);
    PricePlanResponseDto create(PricePlanCreateRequestDto dto);
    PricePlanResponseDto update(UUID id, PricePlanUpdateRequestDto dto);
    void softDelete(UUID id);

    PageResponse<PricePlanResponseDto> list(PricePlanListRequestDto req);
    List<PricePlanDropdownDto> dropdown(String search, UUID appointmentTypeId);
}
