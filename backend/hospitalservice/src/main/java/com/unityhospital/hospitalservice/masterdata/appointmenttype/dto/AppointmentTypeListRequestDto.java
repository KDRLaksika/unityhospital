package com.unityhospital.hospitalservice.masterdata.appointmenttype.dto;

public class AppointmentTypeListRequestDto {
    public int page = 1;
    public int size = 10;

    public String search;
    public String sortBy;
    public String sortDir;

    public Boolean isActive;
}
