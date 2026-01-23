package com.generalgivers.foundation.repository;

import com.generalgivers.foundation.entity.Project;
import com.generalgivers.foundation.entity.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {

    List<Project> findByStatus(ProjectStatus status);

    List<Project> findByCreatedById(UUID createdById);

    long countByStatus(ProjectStatus status);

    long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    List<Project> findTop3ByOrderByCreatedAtDesc();

    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.createdBy WHERE p.status = 'ACTIVE' ORDER BY p.createdAt DESC")
    List<Project> findActiveProjects();

    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.createdBy ORDER BY p.createdAt DESC")
    List<Project> findAllOrderByCreatedAtDesc();
}
