package com.unityhospital.pricingservice.masterdata.priceplan.dto;

import java.math.BigDecimal;
import java.util.UUID;

public class PricePlanDropdownDto {
    public UUID id;
    public String name;
    public BigDecimal amount;
    public String currency;
}
