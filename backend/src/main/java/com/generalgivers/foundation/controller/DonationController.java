package com.generalgivers.foundation.controller;

import com.generalgivers.foundation.dto.common.ApiResponse;
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
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/donations")
@RequiredArgsConstructor
@Tag(name = "Donations", description = "Donation management endpoints")
public class DonationController {

    private final DonationService donationService;

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL', 'TREASURER')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get all donations", description = "Retrieve list of all donations")
    public ResponseEntity<ApiResponse<List<DonationResponse>>> getAllDonations() {
        List<DonationResponse> donations = donationService.getAllDonations();
        return ResponseEntity.ok(ApiResponse.success("Donations retrieved successfully", donations));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL', 'TREASURER')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get donation by ID", description = "Retrieve donation details by ID")
    public ResponseEntity<ApiResponse<DonationResponse>> getDonationById(@PathVariable UUID id) {
        DonationResponse donation = donationService.getDonationById(id);
        return ResponseEntity.ok(ApiResponse.success("Donation retrieved successfully", donation));
    }

    @GetMapping("/project/{projectId}")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL', 'TREASURER', 'ORGANIZING_SECRETARY', 'COMMITTEE_MEMBER')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get donations by project", description = "Retrieve donations for a specific project")
    public ResponseEntity<ApiResponse<List<DonationResponse>>> getDonationsByProject(@PathVariable UUID projectId) {
        List<DonationResponse> donations = donationService.getDonationsByProject(projectId);
        return ResponseEntity.ok(ApiResponse.success("Project donations retrieved successfully", donations));
    }

    @GetMapping("/total")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL', 'TREASURER')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get total donations", description = "Get total donation amount")
    public ResponseEntity<ApiResponse<Map<String, BigDecimal>>> getTotalDonations() {
        BigDecimal total = donationService.getTotalDonations();
        Map<String, BigDecimal> result = Map.of("total", total);
        return ResponseEntity.ok(ApiResponse.success("Total donations retrieved successfully", result));
    }

    @PostMapping
    @Operation(summary = "Create donation", description = "Record a new donation")
    public ResponseEntity<ApiResponse<DonationResponse>> createDonation(
            @Valid @RequestBody DonationRequest request) {
        DonationResponse response = donationService.createDonation(request, null);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Thank you for your donation! Your contribution makes a difference.", response));
    }
}