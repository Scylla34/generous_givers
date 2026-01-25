package com.generalgivers.foundation.dto.user;

import com.generalgivers.foundation.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private UUID id;
    private String memberNumber; // Auto-generated member number (GGF001, etc.)
    private String firstName;
    private String lastName;
    private String name; // Computed full name for backward compatibility
    private String email;
    private String phone;
    private UserRole role;
    private Boolean isActive;
    private Boolean mustChangePassword;
    private String profilePicture;
    private java.time.LocalDate memberJoiningDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String temporaryPassword; // Only included in create response
    private Boolean emailSent; // Indicates if email notification was sent
}
