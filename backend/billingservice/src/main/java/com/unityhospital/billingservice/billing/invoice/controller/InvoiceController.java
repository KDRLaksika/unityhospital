package com.unityhospital.billingservice.billing.invoice.controller;

import com.unityhospital.billingservice.common.dto.ApiResponse;
import com.unityhospital.billingservice.billing.invoice.dto.*;
import com.unityhospital.billingservice.billing.invoice.service.IInvoiceService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final IInvoiceService service;

    public InvoiceController(IInvoiceService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public ApiResponse<InvoiceResponseDto> get(@PathVariable UUID id) {
        return ApiResponse.ok(service.getById(id));
    }

    @PostMapping
    public ApiResponse<InvoiceResponseDto> create(
            @Valid @RequestBody InvoiceCreateRequestDto dto) {
        return ApiResponse.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ApiResponse<InvoiceResponseDto> update(
            @PathVariable UUID id,
            @Valid @RequestBody InvoiceUpdateRequestDto dto) {
        return ApiResponse.ok(service.update(id, dto));
    }
}