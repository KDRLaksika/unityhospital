package com.unityhospital.pharmacyservice.masterdata.drug.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class DrugResponseDto {
    public UUID id;
    public String name;
    public String code;
    public String description;
    public boolean isActive;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;
}