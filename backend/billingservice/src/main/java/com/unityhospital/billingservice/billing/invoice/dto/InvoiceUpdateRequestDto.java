package com.unityhospital.billingservice.billing.invoice.dto;

import jakarta.validation.constraints.NotBlank;

public class InvoiceUpdateRequestDto {

    @NotBlank
    public String status;  // PENDING / PAID
}