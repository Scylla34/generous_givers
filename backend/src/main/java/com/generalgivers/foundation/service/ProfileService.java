package com.generalgivers.foundation.service;

import com.generalgivers.foundation.dto.upload.UploadResponse;
import com.generalgivers.foundation.dto.user.UpdateProfileRequest;
import com.generalgivers.foundation.dto.user.UserResponse;
import com.generalgivers.foundation.entity.ModuleType;
import com.generalgivers.foundation.entity.NotificationType;
import com.generalgivers.foundation.entity.User;
import com.generalgivers.foundation.exception.ResourceNotFoundException;
import com.generalgivers.foundation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileService {

    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final UploadService uploadService;

    @Value("${app.upload.max-file-size:5242880}") // 5MB
    private long maxFileSize;

    @Transactional
    public UserResponse updateProfile(String userEmail, UpdateProfileRequest request) {
        log.info("Updating profile for user: {}", userEmail);
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        // Update user fields
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());

        User savedUser = userRepository.save(user);
        log.info("Profile updated successfully for user: {}", userEmail);

        // Create notification for profile update
        notificationService.createUserNotification(
                "Profile Updated",
                "Your profile information has been updated successfully.",
                NotificationType.SYSTEM_ALERT,
                user.getId()
        );

        return mapToUserResponse(savedUser);
    }

    @Transactional
    public UploadResponse uploadProfilePicture(String userEmail, MultipartFile file) {
        log.info("Uploading profile picture for user: {}", userEmail);

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        try {
            // Validate file
            validateImageFile(file);

            // Upload using the UploadService with USER module type
            UploadResponse uploadResponse = uploadService.uploadFile(file, ModuleType.USER, user.getId(), userEmail);

            // Update user profile picture with the upload ID
            user.setProfilePicture(uploadResponse.getId().toString());
            userRepository.save(user);

            log.info("Profile picture uploaded successfully for user: {}", userEmail);

            // Create notification
            notificationService.createUserNotification(
                    "Profile Picture Updated",
                    "Your profile picture has been updated successfully.",
                    NotificationType.SYSTEM_ALERT,
                    user.getId()
            );

            return uploadResponse;

        } catch (Exception e) {
            log.error("Failed to upload profile picture for user: {}", userEmail, e);
            throw new RuntimeException("Failed to upload profile picture: " + e.getMessage());
        }
    }

    public UserResponse getCurrentProfile(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));
        return mapToUserResponse(user);
    }

    private void validateImageFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("File size exceeds maximum limit of 5MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("File must be an image");
        }

        String[] allowedTypes = {"image/jpeg", "image/png", "image/jpg"};
        boolean isValidType = false;
        for (String type : allowedTypes) {
            if (type.equals(contentType)) {
                isValidType = true;
                break;
            }
        }

        if (!isValidType) {
            throw new IllegalArgumentException("Only JPEG and PNG images are allowed");
        }
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .mustChangePassword(user.getMustChangePassword())
                .profilePicture(user.getProfilePicture())
                .memberJoiningDate(user.getMemberJoiningDate())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}