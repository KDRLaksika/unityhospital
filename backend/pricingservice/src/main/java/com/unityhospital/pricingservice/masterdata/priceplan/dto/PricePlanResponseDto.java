package com.unityhospital.pricingservice.masterdata.priceplan.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class PricePlanResponseDto {
    public UUID id;
    public String name;
    public UUID appointmentTypeId;
    public BigDecimal amount;
    public String currency;
    public LocalDate effectiveFrom;
    public LocalDate effectiveTo;
    public boolean isActive;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;
}
