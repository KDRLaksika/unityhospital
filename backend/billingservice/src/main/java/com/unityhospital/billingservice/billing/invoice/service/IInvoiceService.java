package com.unityhospital.billingservice.billing.invoice.service;

import com.unityhospital.billingservice.common.util.PageResponse;
import com.unityhospital.billingservice.billing.invoice.dto.*;

import java.util.UUID;

public interface IInvoiceService {
    InvoiceResponseDto getById(UUID id);
    InvoiceResponseDto create(InvoiceCreateRequestDto dto);
    InvoiceResponseDto update(UUID id, InvoiceUpdateRequestDto dto);
}