package com.unityhospital.billingservice.billing.invoice.dto;

import com.unityhospital.billingservice.billing.invoice.entity.Invoice;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class InvoiceResponseDto {

    public UUID id;
    public UUID patientId;
    public UUID appointmentId;
    public UUID pricePlanId;
    public BigDecimal totalAmount;
    public String status;
    public boolean isActive;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;

    public static InvoiceResponseDto from(Invoice e) {
        InvoiceResponseDto d = new InvoiceResponseDto();
        d.id = e.getId();
        d.patientId = e.getPatientId();
        d.appointmentId = e.getAppointmentId();
        d.pricePlanId = e.getPricePlanId();
        d.totalAmount = e.getTotalAmount();
        d.status = e.getStatus();
        d.isActive = e.isActive();
        d.createdAt = e.getCreatedAt();
        d.updatedAt = e.getUpdatedAt();
        return d;
    }
}