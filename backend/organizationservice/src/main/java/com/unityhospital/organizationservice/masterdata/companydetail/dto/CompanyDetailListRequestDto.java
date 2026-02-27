package com.unityhospital.organizationservice.masterdata.companydetail.dto;

public class CompanyDetailListRequestDto {
    public int page = 1;
    public int size = 10;

    public String search;
    public Boolean isActive;

    public String sortBy;
    public String sortDir;
}