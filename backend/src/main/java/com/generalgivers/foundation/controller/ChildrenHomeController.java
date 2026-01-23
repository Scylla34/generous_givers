package com.generalgivers.foundation.controller;

import com.generalgivers.foundation.dto.childrenhome.ChildrenHomeRequest;
import com.generalgivers.foundation.dto.childrenhome.ChildrenHomeResponse;
import com.generalgivers.foundation.dto.common.ApiResponse;
import com.generalgivers.foundation.service.ChildrenHomeService;
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
@RequestMapping("/children-homes")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Children Homes", description = "Children home management endpoints")
public class ChildrenHomeController {

    private final ChildrenHomeService childrenHomeService;

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL', 'VICE_CHAIRPERSON', 'TREASURER', 'VICE_SECRETARY', 'ORGANIZING_SECRETARY', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Get all children homes", description = "Retrieve list of all children homes")
    public ResponseEntity<ApiResponse<List<ChildrenHomeResponse>>> getAllChildrenHomes() {
        List<ChildrenHomeResponse> homes = childrenHomeService.getAllChildrenHomes();
        return ResponseEntity.ok(ApiResponse.success("Children homes retrieved successfully", homes));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL', 'VICE_CHAIRPERSON', 'TREASURER', 'VICE_SECRETARY', 'ORGANIZING_SECRETARY', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Get children home by ID", description = "Retrieve children home details by ID")
    public ResponseEntity<ApiResponse<ChildrenHomeResponse>> getChildrenHomeById(@PathVariable UUID id) {
        ChildrenHomeResponse home = childrenHomeService.getChildrenHomeById(id);
        return ResponseEntity.ok(ApiResponse.success("Children home retrieved successfully", home));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL')")
    @Operation(summary = "Create children home", description = "Add a new children home")
    public ResponseEntity<ApiResponse<ChildrenHomeResponse>> createChildrenHome(
            @Valid @RequestBody ChildrenHomeRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        ChildrenHomeResponse response = childrenHomeService.createChildrenHome(request, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Children home created successfully", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL')")
    @Operation(summary = "Update children home", description = "Update children home details")
    public ResponseEntity<ApiResponse<ChildrenHomeResponse>> updateChildrenHome(
            @PathVariable UUID id,
            @Valid @RequestBody ChildrenHomeRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        ChildrenHomeResponse response = childrenHomeService.updateChildrenHome(id, request, userEmail);
        return ResponseEntity.ok(ApiResponse.success("Children home updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON')")
    @Operation(summary = "Delete children home", description = "Delete a children home")
    public ResponseEntity<ApiResponse<Void>> deleteChildrenHome(@PathVariable UUID id, Authentication authentication) {
        String userEmail = authentication.getName();
        childrenHomeService.deleteChildrenHome(id, userEmail);
        return ResponseEntity.ok(ApiResponse.success("Children home deleted successfully", null));
    }
}