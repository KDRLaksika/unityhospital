package com.unityhospital.pricingservice.masterdata.priceplan.repository;

import com.unityhospital.pricingservice.masterdata.priceplan.entity.PricePlan;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;

import java.util.*;

public interface IPricePlanRepository extends JpaRepository<PricePlan, UUID> {

    @Query("""
        select p from PricePlan p
        where (:isActive is null or p.isActive = :isActive)
          and (:appointmentTypeId is null or p.appointmentTypeId = :appointmentTypeId)
          and (
            :search is null or :search = '' or
            lower(p.name) like lower(concat('%', :search, '%'))
          )
    """)
    Page<PricePlan> searchPage(String search, UUID appointmentTypeId, Boolean isActive, Pageable pageable);

    @Query("""
        select p from PricePlan p
        where p.isActive = true
          and (:appointmentTypeId is null or p.appointmentTypeId = :appointmentTypeId)
          and (:search is null or :search = '' or lower(p.name) like lower(concat('%', :search, '%')))
        order by lower(p.name)
    """)
    List<PricePlan> dropdown(String search, UUID appointmentTypeId);
}
