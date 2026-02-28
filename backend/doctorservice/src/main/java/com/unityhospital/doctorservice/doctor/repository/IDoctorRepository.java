package com.unityhospital.doctorservice.doctor.repository;

import com.unityhospital.doctorservice.doctor.entity.Doctor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface IDoctorRepository extends JpaRepository<Doctor, UUID> {

    @Query("""
        select d from Doctor d
        where (:isActive is null or d.isActive = :isActive)
          and (
            :search is null or :search = '' or
            lower(d.fullName) like lower(concat('%', :search, '%')) or
            lower(d.speciality) like lower(concat('%', :search, '%')) or
            lower(d.email) like lower(concat('%', :search, '%'))
          )
    """)
    Page<Doctor> searchPage(String search, Boolean isActive, Pageable pageable);

    @Query("""
        select d from Doctor d
        where d.isActive = true
          and (:search is null or :search = '' or lower(d.fullName) like lower(concat('%', :search, '%')))
        order by lower(d.fullName)
    """)
    List<Doctor> dropdown(String search);
}
