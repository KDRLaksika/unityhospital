package com.unityhospital.organizationservice.masterdata.companydetail.entity;

import com.unityhospital.organizationservice.masterdata.shared.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "company_details")
public class CompanyDetail extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 300)
    private String address;

    @Column(length = 30)
    private String phone;

    @Column(length = 150)
    private String email;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
}