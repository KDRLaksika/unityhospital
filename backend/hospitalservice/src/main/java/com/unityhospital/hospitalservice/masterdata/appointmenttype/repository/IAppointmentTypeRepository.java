package com.unityhospital.hospitalservice.masterdata.appointmenttype.repository;

import com.unityhospital.hospitalservice.masterdata.appointmenttype.entity.AppointmentType;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import java.util.*;

public interface IAppointmentTypeRepository extends JpaRepository<AppointmentType, UUID> {

    @Query("""
        select a from AppointmentType a
        where (:isActive is null or a.isActive = :isActive)
          and (:search is null or :search = '' or lower(a.name) like lower(concat('%', :search, '%')))
    """)
    Page<AppointmentType> searchPage(String search, Boolean isActive, Pageable pageable);

    @Query("""
        select a from AppointmentType a
        where a.isActive = true
          and (:search is null or :search = '' or lower(a.name) like lower(concat('%', :search, '%')))
        order by lower(a.name)
    """)
    List<AppointmentType> dropdown(String search);
}
