package com.unityhospital.organizationservice.masterdata.companydetail.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CompanyDetailUpdateRequestDto {

    @NotBlank
    @Size(max = 200)
    public String name;

    @Size(max = 300)
    public String address;

    @Size(max = 30)
    public String phone;

    @Email
    @Size(max = 150)
    public String email;

    public Boolean isActive;
}