package com.unityhospital.billingservice.billing.invoice.entity;

import com.unityhospital.billingservice.billing.shared.BaseEntity;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "invoices")
public class Invoice extends BaseEntity {

    @Column(nullable = false)
    private UUID patientId;

    @Column(nullable = false)
    private UUID appointmentId;

    @Column(nullable = false)
    private UUID pricePlanId;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Column(nullable = false)
    private String status = "PENDING";

    @Column(nullable = false)
    private boolean isActive = true;

    public UUID getPatientId() { return patientId; }
    public void setPatientId(UUID patientId) { this.patientId = patientId; }

    public UUID getAppointmentId() { return appointmentId; }
    public void setAppointmentId(UUID appointmentId) { this.appointmentId = appointmentId; }

    public UUID getPricePlanId() { return pricePlanId; }
    public void setPricePlanId(UUID pricePlanId) { this.pricePlanId = pricePlanId; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
}