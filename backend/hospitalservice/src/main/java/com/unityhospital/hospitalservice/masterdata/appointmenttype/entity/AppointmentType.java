package com.unityhospital.hospitalservice.masterdata.appointmenttype.entity;

import com.unityhospital.hospitalservice.masterdata.shared.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "appointment_types")
public class AppointmentType extends BaseEntity {

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 300)
    private String description;

    @Column(nullable = false)
    private boolean isActive = true;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
}