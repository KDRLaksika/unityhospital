package com.unityhospital.pricingservice.masterdata.priceplan.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public class PricePlanUpdateRequestDto {

    @NotBlank
    @Size(max = 200)
    public String name;

    @NotNull
    public UUID appointmentTypeId;

    @NotNull
    @DecimalMin(value = "0.00", inclusive = false)
    public BigDecimal amount;

    @NotBlank
    @Size(max = 10)
    public String currency = "LKR";

    @NotNull
    public LocalDate effectiveFrom;

    public LocalDate effectiveTo;

    public Boolean isActive;
}
