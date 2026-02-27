package com.unityhospital.pharmacyservice.masterdata.drug.mapper;

import com.unityhospital.pharmacyservice.masterdata.drug.dto.*;
import com.unityhospital.pharmacyservice.masterdata.drug.entity.Drug;

public class DrugMapper {

    public static DrugResponseDto toDto(Drug e) {
        var d = new DrugResponseDto();
        d.id = e.getId();
        d.name = e.getName();
        d.code = e.getCode();
        d.description = e.getDescription();
        d.isActive = e.isActive();
        d.createdAt = e.getCreatedAt();
        d.updatedAt = e.getUpdatedAt();
        return d;
    }

    public static void applyCreate(Drug e, DrugCreateRequestDto dto) {
        e.setName(dto.name.trim());
        e.setCode(dto.code == null ? null : dto.code.trim());
        e.setDescription(dto.description == null ? null : dto.description.trim());
    }

    public static void applyUpdate(Drug e, DrugUpdateRequestDto dto) {
        e.setName(dto.name.trim());
        e.setCode(dto.code == null ? null : dto.code.trim());
        e.setDescription(dto.description == null ? null : dto.description.trim());
        if (dto.isActive != null) e.setActive(dto.isActive);
    }

    public static DrugDropdownDto toDropdown(Drug e) {
        var d = new DrugDropdownDto();
        d.id = e.getId();
        d.name = e.getName();
        d.code = e.getCode();
        return d;
    }
}