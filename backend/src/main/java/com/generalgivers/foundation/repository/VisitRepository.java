package com.generalgivers.foundation.repository;

import com.generalgivers.foundation.entity.Visit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface VisitRepository extends JpaRepository<Visit, UUID> {

    List<Visit> findByChildrenHomeId(UUID childrenHomeId);

    List<Visit> findByCreatedById(UUID createdById);

    List<Visit> findByVisitDateBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT v FROM Visit v ORDER BY v.visitDate DESC")
    List<Visit> findAllOrderByVisitDateDesc();
}
