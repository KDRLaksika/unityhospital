package com.unityhospital.pricingservice.masterdata.priceplan.controller;

import com.unityhospital.pricingservice.common.dto.ApiResponse;
import com.unityhospital.pricingservice.common.util.PageResponse;
import com.unityhospital.pricingservice.masterdata.priceplan.dto.*;
import com.unityhospital.pricingservice.masterdata.priceplan.service.IPricePlanService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/price-plans")
public class PricePlanController {

    private final IPricePlanService service;

    public PricePlanController(IPricePlanService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public ApiResponse<PricePlanResponseDto> get(@PathVariable UUID id) {
        return ApiResponse.ok(service.getById(id));
    }

    @PostMapping
    public ApiResponse<PricePlanResponseDto> create(@Valid @RequestBody PricePlanCreateRequestDto dto) {
        return ApiResponse.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ApiResponse<PricePlanResponseDto> update(@PathVariable UUID id, @Valid @RequestBody PricePlanUpdateRequestDto dto) {
        return ApiResponse.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Object> delete(@PathVariable UUID id) {
        service.softDelete(id);
        return ApiResponse.ok(null);
    }

    @PostMapping("/list")
    public ApiResponse<PageResponse<PricePlanResponseDto>> list(@RequestBody PricePlanListRequestDto req) {
        return ApiResponse.ok(service.list(req));
    }

    @GetMapping("/dropdown")
    public ApiResponse<List<PricePlanDropdownDto>> dropdown(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID appointmentTypeId
    ) {
        return ApiResponse.ok(service.dropdown(search, appointmentTypeId));
    }
}
