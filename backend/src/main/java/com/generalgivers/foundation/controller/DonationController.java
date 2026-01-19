package com.generalgivers.foundation.controller;

import com.generalgivers.foundation.dto.donation.DonationRequest;
import com.generalgivers.foundation.dto.donation.DonationResponse;
import com.generalgivers.foundation.service.DonationService;
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

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/donations")
@RequiredArgsConstructor
@Tag(name = "Donations", description = "Donation management endpoints")
public class DonationController {

    private final DonationService donationService;

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'TREASURER')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get all donations", description = "Retrieve list of all donations (Admin only)")
    public ResponseEntity<List<DonationResponse>> getAllDonations() {
        return ResponseEntity.ok(donationService.getAllDonations());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'TREASURER')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get donation by ID", description = "Retrieve donation details by ID")
    public ResponseEntity<DonationResponse> getDonationById(@PathVariable UUID id) {
        return ResponseEntity.ok(donationService.getDonationById(id));
    }

    @GetMapping("/user/{userId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get user donations", description = "Retrieve donations by user")
    public ResponseEntity<List<DonationResponse>> getDonationsByUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(donationService.getDonationsByUser(userId));
    }

    @GetMapping("/project/{projectId}")
    @Operation(summary = "Get project donations", description = "Retrieve donations for a specific project")
    public ResponseEntity<List<DonationResponse>> getDonationsByProject(@PathVariable UUID projectId) {
        return ResponseEntity.ok(donationService.getDonationsByProject(projectId));
    }

    @PostMapping
    @Operation(summary = "Create donation", description = "Create a new donation (Public/Guest allowed)")
    public ResponseEntity<DonationResponse> createDonation(
            @Valid @RequestBody DonationRequest request,
            Authentication authentication) {
        String userEmail = authentication != null ? authentication.getName() : null;
        DonationResponse response = donationService.createDonation(request, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/total")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'TREASURER')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get total donations", description = "Get total amount of all donations")
    public ResponseEntity<BigDecimal> getTotalDonations() {
        return ResponseEntity.ok(donationService.getTotalDonations());
    }

    @GetMapping("/total/project/{projectId}")
    @Operation(summary = "Get total donations by project", description = "Get total donations for a specific project")
    public ResponseEntity<BigDecimal> getTotalDonationsByProject(@PathVariable UUID projectId) {
        return ResponseEntity.ok(donationService.getTotalDonationsByProject(projectId));
    }
}
