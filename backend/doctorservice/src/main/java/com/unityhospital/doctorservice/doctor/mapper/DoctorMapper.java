package com.unityhospital.doctorservice.doctor.mapper;

import com.unityhospital.doctorservice.doctor.dto.*;
import com.unityhospital.doctorservice.doctor.entity.Doctor;

public class DoctorMapper {

    public static DoctorResponseDto toDto(Doctor d) {
        var r = new DoctorResponseDto();
        r.id = d.getId();
        r.fullName = d.getFullName();
        r.email = d.getEmail();
        r.phone = d.getPhone();
        r.speciality = d.getSpeciality();
        r.slmcNo = d.getSlmcNo();
        r.isAvailable = d.isAvailable();
        r.isActive = d.isActive();
        r.createdAt = d.getCreatedAt();
        r.updatedAt = d.getUpdatedAt();
        return r;
    }

    public static void applyCreate(Doctor d, DoctorCreateRequestDto dto) {
        d.setFullName(dto.fullName.trim());
        d.setEmail(dto.email != null ? dto.email.trim() : null);
        d.setPhone(dto.phone != null ? dto.phone.trim() : null);
        d.setSpeciality(dto.speciality.trim());
        d.setSlmcNo(dto.slmcNo != null ? dto.slmcNo.trim() : null);
        if (dto.isAvailable != null) d.setAvailable(dto.isAvailable);
    }

    public static void applyUpdate(Doctor d, DoctorUpdateRequestDto dto) {
        d.setFullName(dto.fullName.trim());
        d.setEmail(dto.email != null ? dto.email.trim() : null);
        d.setPhone(dto.phone != null ? dto.phone.trim() : null);
        d.setSpeciality(dto.speciality.trim());
        d.setSlmcNo(dto.slmcNo != null ? dto.slmcNo.trim() : null);
        if (dto.isAvailable != null) d.setAvailable(dto.isAvailable);
    }

    public static DoctorDropdownDto toDropdown(Doctor d) {
        var r = new DoctorDropdownDto();
        r.id = d.getId();
        r.name = "Dr. " + d.getFullName();
        r.speciality = d.getSpeciality();
        return r;
    }
}
