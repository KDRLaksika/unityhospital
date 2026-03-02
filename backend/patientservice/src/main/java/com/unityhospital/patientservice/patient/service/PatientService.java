package com.unityhospital.patientservice.patient.service;

import com.unityhospital.patientservice.common.exception.BadRequestException;
import com.unityhospital.patientservice.common.exception.NotFoundException;
import com.unityhospital.patientservice.common.util.PageResponse;
import com.unityhospital.patientservice.patient.dto.*;
import com.unityhospital.patientservice.patient.entity.*;
import com.unityhospital.patientservice.patient.mapper.PatientMapper;
import com.unityhospital.patientservice.patient.repository.IPatientRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PatientService implements IPatientService {

    private final IPatientRepository patientRepo;

    public PatientService(IPatientRepository patientRepo) {
        this.patientRepo = patientRepo;
    }

    @Transactional(readOnly = true)
    @Override
    public PatientResponseDto getById(UUID id) {
        var patient = patientRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Patient not found: " + id));

        // Force load dependents while the Hibernate session is open
        patient.getDependents().size();

        return PatientMapper.toDto(patient);
    }

    @Override
    @Transactional
    public PatientResponseDto create(PatientCreateRequestDto dto) {
        if (dto.nic != null && !dto.nic.isBlank()) {
            patientRepo.findByNic(dto.nic).ifPresent(p -> {
                throw new BadRequestException("NIC already exists.");
            });
        }

        var p = new Patient();
        applyToEntity(p, dto.firstName, dto.lastName, dto.nic, dto.phone, dto.email, dto.dateOfBirth, dto.gender,
                dto.address, dto.isActive);

        if (dto.dependents != null) {
            for (var depDto : dto.dependents) {
                var dep = new PatientDependent();
                dep.setPatient(p);
                applyDependent(dep, depDto);
                p.getDependents().add(dep);
            }
        }

        var saved = patientRepo.save(p);
        saved.getDependents().size();
        return PatientMapper.toDto(saved);
    }

    @Override
    @Transactional
    public PatientResponseDto update(UUID id, PatientUpdateRequestDto dto) {
        var p = patientRepo.findById(id).orElseThrow(() -> new NotFoundException("Patient not found: " + id));

        if (dto.nic != null && !dto.nic.isBlank()) {
            if (patientRepo.existsByNicAndNotId(dto.nic, id)) {
                throw new BadRequestException("NIC already exists.");
            }
        }

        applyToEntity(p, dto.firstName, dto.lastName, dto.nic, dto.phone, dto.email, dto.dateOfBirth, dto.gender,
                dto.address, dto.isActive);

        // Simple approach: replace dependents list (good for v1)
        if (dto.dependents != null) {
            p.getDependents().clear();
            for (var depDto : dto.dependents) {
                var dep = new PatientDependent();
                dep.setPatient(p);
                applyDependent(dep, depDto);
                p.getDependents().add(dep);
            }
        }

        var saved = patientRepo.save(p);
        saved.getDependents().size();
        return PatientMapper.toDto(saved);
    }

    @Transactional
    @Override
    public void deactivate(UUID id) {
        var patient = patientRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Patient not found: " + id));

        patient.setActive(false);
        patientRepo.save(patient);
    }

    @Override
    public PageResponse<PatientResponseDto> list(PatientListRequestDto req) {
        int page = Math.max(req.page, 0);
        int size = Math.min(Math.max(req.size, 1), 100);

        Sort sort = Sort.by(Sort.Direction.fromString(req.sortDir), req.sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Patient> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (req.isActive == null) {
                req.isActive = true;
            }

            if (req.isActive != null) {
                predicates.add(cb.equal(root.get("isActive"), req.isActive));
            }

            if (req.search != null && !req.search.isBlank()) {
                String s = "%" + req.search.toLowerCase().trim() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("firstName")), s),
                        cb.like(cb.lower(root.get("lastName")), s),
                        cb.like(cb.lower(root.get("nic")), s),
                        cb.like(cb.lower(root.get("phone")), s)));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Patient> pageResult = patientRepo.findAll(spec, pageable);

        // For dependents, don’t fetch in list (heavy). Return basic patient fields only
        // (dependents null).
        var items = pageResult.getContent().stream().map(p -> {
            var dto = new PatientResponseDto();
            dto.id = p.getId();
            dto.firstName = p.getFirstName();
            dto.lastName = p.getLastName();
            dto.nic = p.getNic();
            dto.phone = p.getPhone();
            dto.email = p.getEmail();
            dto.dateOfBirth = p.getDateOfBirth();
            dto.gender = p.getGender();
            dto.address = p.getAddress();
            dto.isActive = p.isActive();
            dto.createdAt = p.getCreatedAt();
            dto.updatedAt = p.getUpdatedAt();
            dto.dependents = null;
            return dto;
        }).collect(Collectors.toList());

        return PageResponse.from(pageResult, items);
    }

    @Override
    public List<PatientDropdownDto> dropdown(String search, Boolean isActive) {
        var req = new PatientListRequestDto();
        req.page = 0;
        req.size = 20;
        req.search = search;
        req.isActive = (isActive == null) ? true : isActive;
        req.sortBy = "firstName";
        req.sortDir = "asc";

        var page = list(req);
        return page.items.stream().map(p -> {
            var d = new PatientDropdownDto();
            d.id = p.id;
            String nic = (p.nic == null || p.nic.isBlank()) ? "" : " (" + p.nic + ")";
            d.name = p.firstName + " " + p.lastName + nic;
            return d;
        }).collect(Collectors.toList());
    }

    private void applyToEntity(Patient p,
            String firstName,
            String lastName,
            String nic,
            String phone,
            String email,
            java.time.LocalDate dob,
            String gender,
            String address,
            Boolean isActive) {
        p.setFirstName(firstName);
        p.setLastName(lastName);
        p.setNic(nic);
        p.setPhone(phone);
        p.setEmail(email);
        p.setDateOfBirth(dob);
        p.setGender(gender);
        p.setAddress(address);
        if (isActive != null)
            p.setActive(isActive);
    }

    private void applyDependent(PatientDependent dep, PatientDependentRequestDto dto) {
        dep.setFullName(dto.fullName);
        dep.setRelationship(dto.relationship);
        dep.setNic(dto.nic);
        dep.setPhone(dto.phone);
        dep.setDateOfBirth(dto.dateOfBirth);
        dep.setGender(dto.gender);
        if (dto.isActive != null)
            dep.setActive(dto.isActive);
    }
}
