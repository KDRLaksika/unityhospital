package com.unityhospital.patientservice.patient.mapper;

import com.unityhospital.patientservice.patient.dto.*;
import com.unityhospital.patientservice.patient.entity.*;

import java.util.stream.Collectors;

public class PatientMapper {

    public static PatientResponseDto toDto(Patient p) {
        var dto = new PatientResponseDto();
        dto.id = p.getId();
        dto.firstName = p.getFirstName();
        dto.lastName = p.getLastName();
        dto.nic = p.getNic();
        dto.phone = p.getPhone();
        dto.email = p.getEmail();
        dto.dateOfBirth = p.getDateOfBirth();
        dto.gender = p.getGender();
        dto.address = p.getAddress();
        dto.isActive = p.isActive();
        dto.createdAt = p.getCreatedAt();
        dto.updatedAt = p.getUpdatedAt();

        dto.dependents = p.getDependents().stream().map(PatientMapper::toDto).collect(Collectors.toList());
        return dto;
    }

    public static PatientDependentResponseDto toDto(PatientDependent d) {
        var dto = new PatientDependentResponseDto();
        dto.id = d.getId();
        dto.patientId = d.getPatient().getId();
        dto.fullName = d.getFullName();
        dto.relationship = d.getRelationship();
        dto.nic = d.getNic();
        dto.phone = d.getPhone();
        dto.dateOfBirth = d.getDateOfBirth();
        dto.gender = d.getGender();
        dto.isActive = d.isActive();
        dto.createdAt = d.getCreatedAt();
        dto.updatedAt = d.getUpdatedAt();
        return dto;
    }
}
