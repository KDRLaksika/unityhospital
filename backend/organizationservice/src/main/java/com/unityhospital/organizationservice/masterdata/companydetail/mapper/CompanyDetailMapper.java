package com.unityhospital.organizationservice.masterdata.companydetail.mapper;

import com.unityhospital.organizationservice.masterdata.companydetail.dto.*;
import com.unityhospital.organizationservice.masterdata.companydetail.entity.CompanyDetail;

public class CompanyDetailMapper {

    public static CompanyDetailResponseDto toDto(CompanyDetail e) {
        var d = new CompanyDetailResponseDto();
        d.id = e.getId();
        d.name = e.getName();
        d.address = e.getAddress();
        d.phone = e.getPhone();
        d.email = e.getEmail();
        d.isActive = e.isActive();
        d.createdAt = e.getCreatedAt();
        d.updatedAt = e.getUpdatedAt();
        return d;
    }

    public static void applyCreate(CompanyDetail e, CompanyDetailCreateRequestDto dto) {
        e.setName(dto.name.trim());
        e.setAddress(dto.address == null ? null : dto.address.trim());
        e.setPhone(dto.phone == null ? null : dto.phone.trim());
        e.setEmail(dto.email == null ? null : dto.email.trim());
    }

    public static void applyUpdate(CompanyDetail e, CompanyDetailUpdateRequestDto dto) {
        e.setName(dto.name.trim());
        e.setAddress(dto.address == null ? null : dto.address.trim());
        e.setPhone(dto.phone == null ? null : dto.phone.trim());
        e.setEmail(dto.email == null ? null : dto.email.trim());
        if (dto.isActive != null) e.setActive(dto.isActive);
    }

    public static CompanyDetailDropdownDto toDropdown(CompanyDetail e) {
        var d = new CompanyDetailDropdownDto();
        d.id = e.getId();
        d.name = e.getName();
        return d;
    }
}