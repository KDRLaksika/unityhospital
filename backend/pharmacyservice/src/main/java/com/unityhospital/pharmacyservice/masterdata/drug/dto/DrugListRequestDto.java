package com.unityhospital.pharmacyservice.masterdata.drug.dto;

public class DrugListRequestDto {
    public int page = 1;
    public int size = 10;

    public String search;
    public Boolean isActive;

    public String sortBy;
    public String sortDir;
}