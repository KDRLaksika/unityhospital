package com.unityhospital.pharmacyservice.masterdata.drug.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class DrugUpdateRequestDto {

    @NotBlank
    @Size(max = 200)
    public String name;

    @Size(max = 50)
    public String code;

    @Size(max = 300)
    public String description;

    public Boolean isActive;
}