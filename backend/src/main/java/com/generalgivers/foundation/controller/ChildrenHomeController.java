package com.generalgivers.foundation.controller;

import com.generalgivers.foundation.dto.childrenhome.ChildrenHomeRequest;
import com.generalgivers.foundation.dto.childrenhome.ChildrenHomeResponse;
import com.generalgivers.foundation.service.ChildrenHomeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRMAN', 'SECRETARY')")
    @Operation(summary = "Get all children homes", description = "Retrieve list of all children homes")
    public ResponseEntity<List<ChildrenHomeResponse>> getAllChildrenHomes() {
        return ResponseEntity.ok(childrenHomeService.getAllChildrenHomes());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRMAN', 'SECRETARY')")
    @Operation(summary = "Get children home by ID", description = "Retrieve children home details by ID")
    public ResponseEntity<ChildrenHomeResponse> getChildrenHomeById(@PathVariable UUID id) {
        return ResponseEntity.ok(childrenHomeService.getChildrenHomeById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRMAN', 'SECRETARY')")
    @Operation(summary = "Create children home", description = "Add a new children home")
    public ResponseEntity<ChildrenHomeResponse> createChildrenHome(
            @Valid @RequestBody ChildrenHomeRequest request) {
        ChildrenHomeResponse response = childrenHomeService.createChildrenHome(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRMAN', 'SECRETARY')")
    @Operation(summary = "Update children home", description = "Update children home details")
    public ResponseEntity<ChildrenHomeResponse> updateChildrenHome(
            @PathVariable UUID id,
            @Valid @RequestBody ChildrenHomeRequest request) {
        return ResponseEntity.ok(childrenHomeService.updateChildrenHome(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_USER')")
    @Operation(summary = "Delete children home", description = "Delete a children home")
    public ResponseEntity<Void> deleteChildrenHome(@PathVariable UUID id) {
        childrenHomeService.deleteChildrenHome(id);
        return ResponseEntity.noContent().build();
    }
}
