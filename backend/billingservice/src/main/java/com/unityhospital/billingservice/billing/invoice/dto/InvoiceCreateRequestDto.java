package com.unityhospital.billingservice.billing.invoice.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

public class InvoiceCreateRequestDto {

    @NotNull
    public UUID patientId;

    @NotNull
    public UUID appointmentId;

    @NotNull
    public UUID pricePlanId;

    @NotNull
    public BigDecimal totalAmount;
}