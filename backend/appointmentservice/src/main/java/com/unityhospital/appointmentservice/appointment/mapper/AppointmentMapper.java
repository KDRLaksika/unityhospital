package com.unityhospital.appointmentservice.appointment.mapper;

import com.unityhospital.appointmentservice.appointment.dto.*;
import com.unityhospital.appointmentservice.appointment.entity.Appointment;

public class AppointmentMapper {

    public static AppointmentResponseDto toDto(Appointment a) {
        var r = new AppointmentResponseDto();
        r.id = a.getId();
        r.patientId = a.getPatientId();
        r.doctorId = a.getDoctorId();
        r.appointmentTypeId = a.getAppointmentTypeId();
        r.appointmentDate = a.getAppointmentDate();
        r.appointmentTime = a.getAppointmentTime();
        r.status = a.getStatus();
        r.note = a.getNote();
        r.isActive = a.isActive();
        r.createdAt = a.getCreatedAt();
        r.updatedAt = a.getUpdatedAt();
        return r;
    }

    public static void applyCreate(Appointment a, AppointmentCreateRequestDto dto) {
        a.setPatientId(dto.patientId);
        a.setDoctorId(dto.doctorId);
        a.setAppointmentTypeId(dto.appointmentTypeId);
        a.setAppointmentDate(dto.appointmentDate);
        a.setAppointmentTime(dto.appointmentTime);
        a.setNote(dto.note);
    }

    public static void applyUpdate(Appointment a, AppointmentUpdateRequestDto dto) {
        a.setPatientId(dto.patientId);
        a.setDoctorId(dto.doctorId);
        a.setAppointmentTypeId(dto.appointmentTypeId);
        a.setAppointmentDate(dto.appointmentDate);
        a.setAppointmentTime(dto.appointmentTime);
        if (dto.status != null) a.setStatus(dto.status);
        a.setNote(dto.note);
        if (dto.isActive != null) a.setActive(dto.isActive);
    }

    public static AppointmentDropdownDto toDropdown(Appointment a) {
        var d = new AppointmentDropdownDto();
        d.id = a.getId();
        d.patientId = a.getPatientId();
        d.doctorId = a.getDoctorId();
        d.appointmentDate = a.getAppointmentDate();
        d.appointmentTime = a.getAppointmentTime();
        d.status = a.getStatus();
        return d;
    }
}
