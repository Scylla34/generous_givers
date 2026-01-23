package com.generalgivers.foundation.controller;

import com.generalgivers.foundation.dto.user.CreateUserRequest;
import com.generalgivers.foundation.dto.user.UpdateUserRequest;
import com.generalgivers.foundation.dto.user.UserResponse;
import com.generalgivers.foundation.entity.UserRole;
import com.generalgivers.foundation.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Users", description = "User management endpoints")
@Slf4j
public class UserController {

    private final UserService userService;

    @GetMapping
    @Operation(summary = "Get all users", description = "Retrieve list of all users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        log.info("GET /users endpoint called");
        List<UserResponse> users = userService.getAllUsers();
        log.info("Returning {} users", users.size());
        return ResponseEntity.ok(users);
    }

    @PostMapping
    @Operation(summary = "Create user", description = "Create a new user (Super User only)")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request, Authentication authentication) {
        boolean hasPermission = authentication.getAuthorities().stream()
            .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_USER"));
        
        if (!hasPermission) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        UserResponse response = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID", description = "Retrieve user details by ID")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update user", description = "Update user profile")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @PatchMapping("/{id}/role")
    @Operation(summary = "Change user role", description = "Update user role (Super User only)")
    public ResponseEntity<UserResponse> updateUserRole(
            @PathVariable UUID id,
            @RequestParam UserRole role,
            Authentication authentication) {
        boolean hasPermission = authentication.getAuthorities().stream()
            .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_USER"));
        
        if (!hasPermission) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        return ResponseEntity.ok(userService.updateUserRole(id, role));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deactivate user", description = "Deactivate user account (Super User only)")
    public ResponseEntity<Void> deactivateUser(@PathVariable UUID id, Authentication authentication) {
        boolean hasPermission = authentication.getAuthorities().stream()
            .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_USER"));
        
        if (!hasPermission) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        userService.deactivateUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/role/{role}")
    @Operation(summary = "Get users by role", description = "Retrieve users filtered by role")
    public ResponseEntity<List<UserResponse>> getUsersByRole(@PathVariable UserRole role) {
        return ResponseEntity.ok(userService.getUsersByRole(role));
    }
}
