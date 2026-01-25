package com.generalgivers.foundation.controller;

import com.generalgivers.foundation.dto.upload.UploadResponse;
import com.generalgivers.foundation.dto.user.UpdateProfileRequest;
import com.generalgivers.foundation.dto.user.UserResponse;
import com.generalgivers.foundation.service.ProfileService;
import com.generalgivers.foundation.service.UploadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Profile", description = "User profile management endpoints")
@Slf4j
public class ProfileController {

    private final ProfileService profileService;
    private final UploadService uploadService;

    @GetMapping
    @Operation(summary = "Get current user profile", description = "Get current authenticated user's profile information")
    public ResponseEntity<UserResponse> getCurrentProfile(Authentication authentication) {
        log.info("Getting profile for user: {}", authentication.getName());
        UserResponse profile = profileService.getCurrentProfile(authentication.getName());
        return ResponseEntity.ok(profile);
    }

    @PutMapping
    @Operation(summary = "Update profile", description = "Update current user's profile information")
    public ResponseEntity<UserResponse> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Authentication authentication) {
        log.info("Updating profile for user: {}", authentication.getName());
        UserResponse updatedProfile = profileService.updateProfile(authentication.getName(), request);
        return ResponseEntity.ok(updatedProfile);
    }

    @PostMapping("/picture")
    @Operation(summary = "Upload profile picture", description = "Upload and update user's profile picture")
    public ResponseEntity<UploadResponse> uploadProfilePicture(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        log.info("Uploading profile picture for user: {}", authentication.getName());

        try {
            UploadResponse uploadResponse = profileService.uploadProfilePicture(authentication.getName(), file);
            return ResponseEntity.ok(uploadResponse);
        } catch (Exception e) {
            log.error("Failed to upload profile picture for user: {}", authentication.getName(), e);
            throw new RuntimeException("Failed to upload profile picture: " + e.getMessage());
        }
    }

    @GetMapping("/picture/{uploadId}")
    @Operation(summary = "Get profile picture", description = "Retrieve user's profile picture by upload ID")
    public ResponseEntity<Resource> getProfilePicture(@PathVariable String uploadId) {
        try {
            UUID id = UUID.fromString(uploadId);
            Resource resource = uploadService.downloadFile(id);
            String contentType = uploadService.getContentType(id);
            String originalFileName = uploadService.getOriginalFileName(id);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CACHE_CONTROL, "max-age=3600")
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + originalFileName + "\"")
                    .body(resource);
        } catch (IllegalArgumentException e) {
            log.error("Invalid upload ID format: {}", uploadId);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error retrieving profile picture: {}", uploadId, e);
            return ResponseEntity.notFound().build();
        }
    }
}
