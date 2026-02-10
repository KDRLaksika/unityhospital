package com.unityhospital.appointmentservice.appointment.dto;

import com.unityhospital.appointmentservice.appointment.entity.AppointmentStatus;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public class AppointmentDropdownDto {
    public UUID id;
    public UUID patientId;
    public UUID doctorId;
    public LocalDate appointmentDate;
    public LocalTime appointmentTime;
    public AppointmentStatus status;
}
