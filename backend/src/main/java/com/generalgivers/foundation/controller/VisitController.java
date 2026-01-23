package com.generalgivers.foundation.controller;

import com.generalgivers.foundation.dto.common.ApiResponse;
import com.generalgivers.foundation.dto.visit.VisitRequest;
import com.generalgivers.foundation.dto.visit.VisitResponse;
import com.generalgivers.foundation.service.VisitService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/visits")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Visits", description = "Visit management endpoints")
public class VisitController {

    private final VisitService visitService;

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL', 'VICE_CHAIRPERSON', 'TREASURER', 'VICE_SECRETARY', 'ORGANIZING_SECRETARY', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Get all visits", description = "Retrieve list of all visits")
    public ResponseEntity<ApiResponse<List<VisitResponse>>> getAllVisits() {
        List<VisitResponse> visits = visitService.getAllVisits();
        return ResponseEntity.ok(ApiResponse.success("Visits retrieved successfully", visits));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL', 'VICE_CHAIRPERSON', 'TREASURER', 'VICE_SECRETARY', 'ORGANIZING_SECRETARY', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Get visit by ID", description = "Retrieve visit details by ID")
    public ResponseEntity<ApiResponse<VisitResponse>> getVisitById(@PathVariable UUID id) {
        VisitResponse visit = visitService.getVisitById(id);
        return ResponseEntity.ok(ApiResponse.success("Visit retrieved successfully", visit));
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL', 'VICE_CHAIRPERSON', 'TREASURER', 'VICE_SECRETARY', 'ORGANIZING_SECRETARY', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Get visits by date range", description = "Retrieve visits within a date range")
    public ResponseEntity<ApiResponse<List<VisitResponse>>> getVisitsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        List<VisitResponse> visits = visitService.getVisitsByDateRange(from, to);
        return ResponseEntity.ok(ApiResponse.success("Visits retrieved successfully", visits));
    }

    @GetMapping("/children-home/{childrenHomeId}")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL', 'VICE_CHAIRPERSON', 'TREASURER', 'VICE_SECRETARY', 'ORGANIZING_SECRETARY', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Get visits by children home", description = "Retrieve visits for a specific children home")
    public ResponseEntity<ApiResponse<List<VisitResponse>>> getVisitsByChildrenHome(@PathVariable UUID childrenHomeId) {
        List<VisitResponse> visits = visitService.getVisitsByChildrenHome(childrenHomeId);
        return ResponseEntity.ok(ApiResponse.success("Visits retrieved successfully", visits));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL', 'ORGANIZING_SECRETARY')")
    @Operation(summary = "Create visit", description = "Record a new visit")
    public ResponseEntity<ApiResponse<VisitResponse>> createVisit(
            @Valid @RequestBody VisitRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        VisitResponse response = visitService.createVisit(request, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Visit recorded successfully", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL', 'ORGANIZING_SECRETARY')")
    @Operation(summary = "Update visit", description = "Update visit details")
    public ResponseEntity<ApiResponse<VisitResponse>> updateVisit(
            @PathVariable UUID id,
            @Valid @RequestBody VisitRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        VisitResponse response = visitService.updateVisit(id, request, userEmail);
        return ResponseEntity.ok(ApiResponse.success("Visit updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON')")
    @Operation(summary = "Delete visit", description = "Delete a visit record")
    public ResponseEntity<ApiResponse<Void>> deleteVisit(@PathVariable UUID id, Authentication authentication) {
        String userEmail = authentication.getName();
        visitService.deleteVisit(id, userEmail);
        return ResponseEntity.ok(ApiResponse.success("Visit deleted successfully", null));
    }
}