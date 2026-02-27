package com.unityhospital.pharmacyservice.masterdata.drug.entity;

import com.unityhospital.pharmacyservice.masterdata.shared.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "drugs")
public class Drug extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 50, unique = true)
    private String code;

    @Column(length = 300)
    private String description;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
}