package com.generalgivers.foundation.repository;

import com.generalgivers.foundation.entity.Project;
import com.generalgivers.foundation.entity.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {

    List<Project> findByStatus(ProjectStatus status);

    List<Project> findByCreatedById(UUID createdById);

    @Query("SELECT p FROM Project p WHERE p.status = 'ACTIVE' ORDER BY p.createdAt DESC")
    List<Project> findActiveProjects();

    @Query("SELECT p FROM Project p ORDER BY p.createdAt DESC")
    List<Project> findAllOrderByCreatedAtDesc();
}
