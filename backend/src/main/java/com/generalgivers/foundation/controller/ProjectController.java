package com.generalgivers.foundation.controller;

import com.generalgivers.foundation.dto.common.ApiResponse;
import com.generalgivers.foundation.dto.project.ProjectRequest;
import com.generalgivers.foundation.dto.project.ProjectResponse;
import com.generalgivers.foundation.entity.ProjectStatus;
import com.generalgivers.foundation.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
@Tag(name = "Projects", description = "Project management endpoints")
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    @Operation(summary = "Get all projects", description = "Retrieve list of all projects")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getAllProjects() {
        List<ProjectResponse> projects = projectService.getAllProjects();
        return ResponseEntity.ok(ApiResponse.success(
            "Projects retrieved successfully", 
            projects
        ));
    }

    @GetMapping("/active")
    @Operation(summary = "Get active projects", description = "Retrieve list of active projects")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getActiveProjects() {
        List<ProjectResponse> projects = projectService.getActiveProjects();
        return ResponseEntity.ok(ApiResponse.success(
            "Active projects retrieved successfully", 
            projects
        ));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get projects by status", description = "Retrieve projects filtered by status")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getProjectsByStatus(@PathVariable ProjectStatus status) {
        List<ProjectResponse> projects = projectService.getProjectsByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(
            "Projects with status " + status + " retrieved successfully", 
            projects
        ));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get project by ID", description = "Retrieve project details by ID")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProjectById(@PathVariable UUID id) {
        ProjectResponse project = projectService.getProjectById(id);
        return ResponseEntity.ok(ApiResponse.success(
            "Project retrieved successfully", 
            project
        ));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create project", description = "Create a new project (Admin only)")
    public ResponseEntity<ApiResponse<ProjectResponse>> createProject(
            @Valid @RequestBody ProjectRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        ProjectResponse response = projectService.createProject(request, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
            "Project created successfully", 
            response
        ));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update project", description = "Update project details (Admin only)")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProject(
            @PathVariable UUID id,
            @Valid @RequestBody ProjectRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        ProjectResponse response = projectService.updateProject(id, request, userEmail);
        return ResponseEntity.ok(ApiResponse.success(
            "Project updated successfully", 
            response
        ));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete project", description = "Delete a project (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable UUID id, Authentication authentication) {
        String userEmail = authentication.getName();
        projectService.deleteProject(id, userEmail);
        return ResponseEntity.ok(ApiResponse.success(
            "Project deleted successfully", 
            null
        ));
    }
}
