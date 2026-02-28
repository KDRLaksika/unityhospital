package com.unityhospital.appointmentservice.appointment.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public class AppointmentCreateRequestDto {

    @NotNull
    public UUID patientId;

    @NotNull
    public UUID doctorId;

    public UUID appointmentTypeId; // optional

    @NotNull
    public LocalDate appointmentDate;

    @NotNull
    public LocalTime appointmentTime;

    public String note;
}
