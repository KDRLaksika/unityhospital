package com.unityhospital.pricingservice.masterdata.priceplan.entity;

import com.unityhospital.pricingservice.masterdata.shared.BaseEntity;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "price_plans")
public class PricePlan extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String name;

    @Column(name = "appointment_type_id", columnDefinition = "uuid", nullable = false)
    private UUID appointmentTypeId;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 10)
    private String currency = "LKR";

    @Column(name = "effective_from", nullable = false)
    private LocalDate effectiveFrom;

    @Column(name = "effective_to")
    private LocalDate effectiveTo;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public UUID getAppointmentTypeId() { return appointmentTypeId; }
    public void setAppointmentTypeId(UUID appointmentTypeId) { this.appointmentTypeId = appointmentTypeId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public LocalDate getEffectiveFrom() { return effectiveFrom; }
    public void setEffectiveFrom(LocalDate effectiveFrom) { this.effectiveFrom = effectiveFrom; }

    public LocalDate getEffectiveTo() { return effectiveTo; }
    public void setEffectiveTo(LocalDate effectiveTo) { this.effectiveTo = effectiveTo; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
}
