package com.generalgivers.foundation.service;

import com.generalgivers.foundation.dto.project.ProjectRequest;
import com.generalgivers.foundation.dto.project.ProjectResponse;
import com.generalgivers.foundation.entity.Project;
import com.generalgivers.foundation.entity.ProjectStatus;
import com.generalgivers.foundation.entity.User;
import com.generalgivers.foundation.exception.ResourceNotFoundException;
import com.generalgivers.foundation.repository.ProjectRepository;
import com.generalgivers.foundation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectNotificationService projectNotificationService;

    public List<ProjectResponse> getAllProjects() {
        List<Project> projects = projectRepository.findAllOrderByCreatedAtDesc();
        return projects.stream()
                .map(this::mapToProjectResponse)
                .collect(Collectors.toList());
    }

    public List<ProjectResponse> getActiveProjects() {
        List<Project> projects = projectRepository.findActiveProjects();
        return projects.stream()
                .map(this::mapToProjectResponse)
                .collect(Collectors.toList());
    }

    public List<ProjectResponse> getProjectsByStatus(ProjectStatus status) {
        return projectRepository.findByStatus(status).stream()
                .map(this::mapToProjectResponse)
                .collect(Collectors.toList());
    }

    public ProjectResponse getProjectById(UUID id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        return mapToProjectResponse(project);
    }

    @Transactional
    public ProjectResponse createProject(ProjectRequest request, String userEmail) {
        User creator = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : ProjectStatus.DRAFT)
                .targetAmount(request.getTargetAmount() != null ? request.getTargetAmount() : BigDecimal.ZERO)
                .fundsRaised(BigDecimal.ZERO)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .poster(request.getPoster())
                .createdBy(creator)
                .build();

        project = projectRepository.save(project);
        
        // Send notifications (optional - don't fail if this errors)
        try {
            projectNotificationService.notifyProjectCreated(project.getTitle(), creator.getName());
        } catch (Exception e) {
            log.warn("Failed to send project creation notifications: {}", e.getMessage());
        }
        
        return mapToProjectResponse(project);
    }

    @Transactional
    public ProjectResponse updateProject(UUID id, ProjectRequest request, String userEmail) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        User updater = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        ProjectStatus oldStatus = project.getStatus();
        
        if (request.getTitle() != null) {
            project.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            project.setDescription(request.getDescription());
        }
        if (request.getStatus() != null) {
            project.setStatus(request.getStatus());
        }
        if (request.getTargetAmount() != null) {
            project.setTargetAmount(request.getTargetAmount());
        }
        if (request.getStartDate() != null) {
            project.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            project.setEndDate(request.getEndDate());
        }
        if (request.getPoster() != null) {
            project.setPoster(request.getPoster());
        }

        project = projectRepository.save(project);
        
        // Send notifications (optional - don't fail if this errors)
        try {
            projectNotificationService.notifyProjectUpdated(project.getTitle(), updater.getName());
            
            // Special notification for project completion
            if (oldStatus != ProjectStatus.COMPLETED && project.getStatus() == ProjectStatus.COMPLETED) {
                projectNotificationService.notifyProjectCompleted(project.getTitle());
            }
        } catch (Exception e) {
            log.warn("Failed to send project update notifications: {}", e.getMessage());
        }
        
        return mapToProjectResponse(project);
    }

    @Transactional
    public void deleteProject(UUID id, String userEmail) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        
        User deleter = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));
        
        String projectTitle = project.getTitle();
        
        projectRepository.deleteById(id);
        
        // Send deletion notification (optional - don't fail if this errors)
        try {
            projectNotificationService.notifyProjectDeleted(projectTitle, deleter.getName());
        } catch (Exception e) {
            log.warn("Failed to send project deletion notifications: {}", e.getMessage());
        }
    }

    private ProjectResponse mapToProjectResponse(Project project) {
        Double percentFunded = calculatePercentFunded(project.getFundsRaised(), project.getTargetAmount());

        return ProjectResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .status(project.getStatus())
                .targetAmount(project.getTargetAmount())
                .fundsRaised(project.getFundsRaised())
                .percentFunded(percentFunded)
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .createdById(project.getCreatedBy() != null ? project.getCreatedBy().getId() : null)
                .createdByName(project.getCreatedBy() != null ? project.getCreatedBy().getName() : null)
                .createdAt(project.getCreatedAt())
                .poster(project.getPoster())
                .build();
    }

    private Double calculatePercentFunded(BigDecimal fundsRaised, BigDecimal targetAmount) {
        if (targetAmount == null || targetAmount.compareTo(BigDecimal.ZERO) == 0) {
            return 0.0;
        }
        return fundsRaised.divide(targetAmount, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();
    }
}
