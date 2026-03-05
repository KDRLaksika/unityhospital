package com.unityhospital.billingservice.billing.invoice.repository;

import com.unityhospital.billingservice.billing.invoice.entity.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface IInvoiceRepository extends JpaRepository<Invoice, UUID> {
    Page<Invoice> findByIsActive(boolean isActive, Pageable pageable);
}