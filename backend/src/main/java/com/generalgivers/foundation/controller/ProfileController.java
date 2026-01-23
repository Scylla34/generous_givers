package com.generalgivers.foundation.controller;

import com.generalgivers.foundation.dto.user.UpdateProfileRequest;
import com.generalgivers.foundation.dto.user.UserResponse;
import com.generalgivers.foundation.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Profile", description = "User profile management endpoints")
@Slf4j
public class ProfileController {

    private final ProfileService profileService;

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
    public ResponseEntity<Map<String, String>> uploadProfilePicture(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        log.info("Uploading profile picture for user: {}", authentication.getName());
        
        try {
            String fileName = profileService.uploadProfilePicture(authentication.getName(), file);
            
            Map<String, String> response = new HashMap<>();
            response.put("fileName", fileName);
            response.put("message", "Profile picture uploaded successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to upload profile picture for user: {}", authentication.getName(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/picture/{fileName}")
    @Operation(summary = "Get profile picture", description = "Retrieve user's profile picture")
    public ResponseEntity<Resource> getProfilePicture(@PathVariable String fileName) {
        try {
            Path filePath = Paths.get("uploads/profile-pictures").resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                String contentType = "image/jpeg";
                if (fileName.toLowerCase().endsWith(".png")) {
                    contentType = "image/png";
                }
                
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CACHE_CONTROL, "max-age=3600")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error retrieving profile picture: {}", fileName, e);
            return ResponseEntity.notFound().build();
        }
    }
}