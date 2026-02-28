package com.unityhospital.pharmacyservice.masterdata.drug.repository;

import com.unityhospital.pharmacyservice.masterdata.drug.entity.Drug;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;

import java.util.*;

public interface IDrugRepository extends JpaRepository<Drug, UUID> {

    @Query("""
        select d from Drug d
        where (:isActive is null or d.isActive = :isActive)
          and (
            :search is null or :search = '' or
            lower(d.name) like lower(concat('%', :search, '%')) or
            lower(coalesce(d.code, '')) like lower(concat('%', :search, '%'))
          )
    """)
    Page<Drug> searchPage(String search, Boolean isActive, Pageable pageable);

    @Query("""
        select d from Drug d
        where d.isActive = true
          and (:search is null or :search = '' or
               lower(d.name) like lower(concat('%', :search, '%')) or
               lower(coalesce(d.code, '')) like lower(concat('%', :search, '%')))
        order by lower(d.name)
    """)
    List<Drug> dropdown(String search);
}