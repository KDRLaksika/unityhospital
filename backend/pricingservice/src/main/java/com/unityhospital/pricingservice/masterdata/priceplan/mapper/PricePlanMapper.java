package com.unityhospital.pricingservice.masterdata.priceplan.mapper;

import com.unityhospital.pricingservice.masterdata.priceplan.dto.*;
import com.unityhospital.pricingservice.masterdata.priceplan.entity.PricePlan;

public class PricePlanMapper {

    public static PricePlanResponseDto toDto(PricePlan e) {
        var d = new PricePlanResponseDto();
        d.id = e.getId();
        d.name = e.getName();
        d.appointmentTypeId = e.getAppointmentTypeId();
        d.amount = e.getAmount();
        d.currency = e.getCurrency();
        d.effectiveFrom = e.getEffectiveFrom();
        d.effectiveTo = e.getEffectiveTo();
        d.isActive = e.isActive();
        d.createdAt = e.getCreatedAt();
        d.updatedAt = e.getUpdatedAt();
        return d;
    }

    public static void applyCreate(PricePlan e, PricePlanCreateRequestDto dto) {
        e.setName(dto.name.trim());
        e.setAppointmentTypeId(dto.appointmentTypeId);
        e.setAmount(dto.amount);
        e.setCurrency(dto.currency == null ? "LKR" : dto.currency.trim());
        e.setEffectiveFrom(dto.effectiveFrom);
        e.setEffectiveTo(dto.effectiveTo);
    }

    public static void applyUpdate(PricePlan e, PricePlanUpdateRequestDto dto) {
        e.setName(dto.name.trim());
        e.setAppointmentTypeId(dto.appointmentTypeId);
        e.setAmount(dto.amount);
        e.setCurrency(dto.currency == null ? "LKR" : dto.currency.trim());
        e.setEffectiveFrom(dto.effectiveFrom);
        e.setEffectiveTo(dto.effectiveTo);
        if (dto.isActive != null) e.setActive(dto.isActive);
    }

    public static PricePlanDropdownDto toDropdown(PricePlan e) {
        var d = new PricePlanDropdownDto();
        d.id = e.getId();
        d.name = e.getName();
        d.amount = e.getAmount();
        d.currency = e.getCurrency();
        return d;
    }
}
