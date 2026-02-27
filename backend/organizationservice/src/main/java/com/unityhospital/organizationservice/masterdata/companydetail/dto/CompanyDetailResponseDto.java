package com.unityhospital.organizationservice.masterdata.companydetail.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class CompanyDetailResponseDto {
    public UUID id;
    public String name;
    public String address;
    public String phone;
    public String email;
    public boolean isActive;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;
}