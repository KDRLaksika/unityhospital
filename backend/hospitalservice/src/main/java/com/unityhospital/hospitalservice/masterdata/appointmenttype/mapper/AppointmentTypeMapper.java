package com.unityhospital.hospitalservice.masterdata.appointmenttype.mapper;

import com.unityhospital.hospitalservice.masterdata.appointmenttype.dto.*;
import com.unityhospital.hospitalservice.masterdata.appointmenttype.entity.AppointmentType;

public class AppointmentTypeMapper {

    public static AppointmentTypeResponseDto toDto(AppointmentType e) {
        var d = new AppointmentTypeResponseDto();
        d.id = e.getId();
        d.name = e.getName();
        d.description = e.getDescription();
        d.isActive = e.isActive();
        d.createdAt = e.getCreatedAt();
        d.updatedAt = e.getUpdatedAt();
        return d;
    }

    public static void applyCreate(AppointmentType e, AppointmentTypeCreateRequestDto dto) {
        e.setName(dto.name.trim());
        e.setDescription(dto.description != null ? dto.description.trim() : null);
    }

    public static void applyUpdate(AppointmentType e, AppointmentTypeUpdateRequestDto dto) {
        e.setName(dto.name.trim());
        e.setDescription(dto.description != null ? dto.description.trim() : null);
        if (dto.isActive != null) e.setActive(dto.isActive);
    }

    public static AppointmentTypeDropdownDto toDropdown(AppointmentType e) {
        var d = new AppointmentTypeDropdownDto();
        d.id = e.getId();
        d.name = e.getName();
        return d;
    }
}
