package com.unityhospital.appointmentservice.appointment.dto;

import com.unityhospital.appointmentservice.appointment.entity.AppointmentStatus;

import java.time.LocalDate;
import java.util.UUID;

public class AppointmentListRequestDto {
    public int page = 1;
    public int size = 10;

    public String search; // optional text in note (basic)
    public UUID patientId; // optional filter
    public UUID doctorId;  // optional filter
    public AppointmentStatus status; // optional filter
    public LocalDate fromDate; // optional
    public LocalDate toDate;   // optional

    public String sortBy;  // appointmentDate | createdAt
    public String sortDir; // asc | desc

    public Boolean isActive; // null = all
}
