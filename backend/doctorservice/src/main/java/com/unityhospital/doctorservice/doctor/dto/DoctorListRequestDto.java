package com.unityhospital.doctorservice.doctor.dto;

public class DoctorListRequestDto {
    public int page = 1;
    public int size = 10;

    public String search;      // searches fullName/speciality/email
    public String sortBy;      // fullName, speciality, createdAt
    public String sortDir;     // asc, desc

    public Boolean isActive;   // null = all
}
