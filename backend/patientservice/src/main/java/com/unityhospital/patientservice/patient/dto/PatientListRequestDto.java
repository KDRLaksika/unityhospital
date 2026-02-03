package com.unityhospital.patientservice.patient.dto;

public class PatientListRequestDto {
    public int page = 0;
    public int size = 10;

    public String search;     // name / nic / phone
    public Boolean isActive;  // null = all

    public String sortBy = "createdAt";
    public String sortDir = "desc"; // asc/desc
}
