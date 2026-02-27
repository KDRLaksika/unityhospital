package com.unityhospital.pricingservice.masterdata.priceplan.dto;

import java.util.UUID;

public class PricePlanListRequestDto {
    public int page = 1;
    public int size = 10;

    public String search;
    public UUID appointmentTypeId;
    public Boolean isActive;

    public String sortBy;
    public String sortDir;
}
