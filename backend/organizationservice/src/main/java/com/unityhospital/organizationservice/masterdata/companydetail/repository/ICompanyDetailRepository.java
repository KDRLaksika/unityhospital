package com.unityhospital.organizationservice.masterdata.companydetail.repository;

import com.unityhospital.organizationservice.masterdata.companydetail.entity.CompanyDetail;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;

import java.util.*;

public interface ICompanyDetailRepository extends JpaRepository<CompanyDetail, UUID> {

    @Query("""
        select c from CompanyDetail c
        where (:isActive is null or c.isActive = :isActive)
          and (
            :search is null or :search = '' or
            lower(c.name) like lower(concat('%', :search, '%')) or
            lower(coalesce(c.email, '')) like lower(concat('%', :search, '%')) or
            lower(coalesce(c.phone, '')) like lower(concat('%', :search, '%'))
          )
    """)
    Page<CompanyDetail> searchPage(String search, Boolean isActive, Pageable pageable);

    @Query("""
        select c from CompanyDetail c
        where c.isActive = true
          and (:search is null or :search = '' or lower(c.name) like lower(concat('%', :search, '%')))
        order by lower(c.name)
    """)
    List<CompanyDetail> dropdown(String search);
}