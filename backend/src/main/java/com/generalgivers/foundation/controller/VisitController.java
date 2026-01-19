package com.generalgivers.foundation.controller;

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
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL')")
    @Operation(summary = "Get all visits", description = "Retrieve list of all visits")
    public ResponseEntity<List<VisitResponse>> getAllVisits() {
        return ResponseEntity.ok(visitService.getAllVisits());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL')")
    @Operation(summary = "Get visit by ID", description = "Retrieve visit details by ID")
    public ResponseEntity<VisitResponse> getVisitById(@PathVariable UUID id) {
        return ResponseEntity.ok(visitService.getVisitById(id));
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL')")
    @Operation(summary = "Get visits by date range", description = "Retrieve visits within a date range")
    public ResponseEntity<List<VisitResponse>> getVisitsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(visitService.getVisitsByDateRange(from, to));
    }

    @GetMapping("/children-home/{childrenHomeId}")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL')")
    @Operation(summary = "Get visits by children home", description = "Retrieve visits for a specific children home")
    public ResponseEntity<List<VisitResponse>> getVisitsByChildrenHome(@PathVariable UUID childrenHomeId) {
        return ResponseEntity.ok(visitService.getVisitsByChildrenHome(childrenHomeId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL')")
    @Operation(summary = "Create visit", description = "Record a new visit")
    public ResponseEntity<VisitResponse> createVisit(
            @Valid @RequestBody VisitRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        VisitResponse response = visitService.createVisit(request, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL')")
    @Operation(summary = "Update visit", description = "Update visit details")
    public ResponseEntity<VisitResponse> updateVisit(
            @PathVariable UUID id,
            @Valid @RequestBody VisitRequest request) {
        return ResponseEntity.ok(visitService.updateVisit(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON')")
    @Operation(summary = "Delete visit", description = "Delete a visit record")
    public ResponseEntity<Void> deleteVisit(@PathVariable UUID id) {
        visitService.deleteVisit(id);
        return ResponseEntity.noContent().build();
    }
}
