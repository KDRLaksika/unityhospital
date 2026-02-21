package com.unityhospital.hospitalservice.masterdata.appointmenttype.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AppointmentTypeUpdateRequestDto {
    @NotBlank
    @Size(max = 150)
    public String name;

    @Size(max = 300)
    public String description;

    public Boolean isActive;
}
