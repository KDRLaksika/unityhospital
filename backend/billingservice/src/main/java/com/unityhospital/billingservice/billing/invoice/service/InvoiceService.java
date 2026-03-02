package com.unityhospital.billingservice.billing.invoice.service;

import com.unityhospital.billingservice.common.util.PageResponse;
import com.unityhospital.billingservice.billing.invoice.dto.*;
import com.unityhospital.billingservice.billing.invoice.entity.Invoice;
import com.unityhospital.billingservice.billing.invoice.repository.IInvoiceRepository;
import com.unityhospital.billingservice.common.exception.NotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class InvoiceService implements IInvoiceService {

    private final IInvoiceRepository repo;

    public InvoiceService(IInvoiceRepository repo) {
        this.repo = repo;
    }

    @Override
    public InvoiceResponseDto getById(UUID id) {
        var e = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Invoice not found"));
        return InvoiceResponseDto.from(e);
    }

    @Override
    public InvoiceResponseDto create(InvoiceCreateRequestDto dto) {
        Invoice e = new Invoice();
        e.setPatientId(dto.patientId);
        e.setAppointmentId(dto.appointmentId);
        e.setPricePlanId(dto.pricePlanId);
        e.setTotalAmount(dto.totalAmount);
        return InvoiceResponseDto.from(repo.save(e));
    }

    @Override
    public InvoiceResponseDto update(UUID id, InvoiceUpdateRequestDto dto) {
        var e = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Invoice not found"));
        e.setStatus(dto.status);
        return InvoiceResponseDto.from(repo.save(e));
    }

    @Override
    public PageResponse<InvoiceResponseDto> list(InvoiceListRequestDto req) {
        var pageable = org.springframework.data.domain.PageRequest.of(req.page, req.size);
        var page = repo.findAll(pageable);
        return PageResponse.of(
                page.getContent().stream().map(InvoiceResponseDto::from).toList(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages());
    }
}