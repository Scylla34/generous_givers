package com.generalgivers.foundation.service;

import com.generalgivers.foundation.dto.user.UpdateProfileRequest;
import com.generalgivers.foundation.dto.user.UserResponse;
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

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileService {

    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Value("${app.upload.profile-pictures:uploads/profile-pictures}")
    private String uploadDir;

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
    public String uploadProfilePicture(String userEmail, MultipartFile file) {
        log.info("Uploading profile picture for user: {}", userEmail);
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        try {
            // Validate file
            validateImageFile(file);
            
            // Process and save image
            String fileName = processAndSaveImage(file, user.getId());
            
            // Update user profile picture path
            user.setProfilePicture(fileName);
            userRepository.save(user);
            
            log.info("Profile picture uploaded successfully for user: {}", userEmail);
            
            // Create notification
            notificationService.createUserNotification(
                    "Profile Picture Updated",
                    "Your profile picture has been updated successfully.",
                    NotificationType.SYSTEM_ALERT,
                    user.getId()
            );
            
            return fileName;
            
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

    private String processAndSaveImage(MultipartFile file, UUID userId) throws IOException {
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Read original image
        BufferedImage originalImage = ImageIO.read(new ByteArrayInputStream(file.getBytes()));
        if (originalImage == null) {
            throw new IllegalArgumentException("Invalid image file");
        }

        // Resize and compress image
        BufferedImage resizedImage = resizeImage(originalImage, 300, 300);
        
        // Generate unique filename
        String fileExtension = getFileExtension(file.getOriginalFilename());
        String fileName = userId + "_" + System.currentTimeMillis() + "." + fileExtension;
        Path filePath = uploadPath.resolve(fileName);

        // Save compressed image
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(resizedImage, fileExtension, baos);
        Files.write(filePath, baos.toByteArray());

        log.info("Image processed and saved: {}", fileName);
        return fileName;
    }

    private BufferedImage resizeImage(BufferedImage originalImage, int targetWidth, int targetHeight) {
        // Calculate dimensions to maintain aspect ratio
        int originalWidth = originalImage.getWidth();
        int originalHeight = originalImage.getHeight();
        
        double aspectRatio = (double) originalWidth / originalHeight;
        int newWidth, newHeight;
        
        if (aspectRatio > 1) {
            newWidth = targetWidth;
            newHeight = (int) (targetWidth / aspectRatio);
        } else {
            newHeight = targetHeight;
            newWidth = (int) (targetHeight * aspectRatio);
        }

        // Create resized image
        BufferedImage resizedImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = resizedImage.createGraphics();
        
        // Enable high-quality rendering
        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g2d.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        
        g2d.drawImage(originalImage, 0, 0, newWidth, newHeight, null);
        g2d.dispose();
        
        return resizedImage;
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf('.') == -1) {
            return "jpg";
        }
        return fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
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