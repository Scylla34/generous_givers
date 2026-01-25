package com.generalgivers.foundation.service;

import com.generalgivers.foundation.entity.ModuleType;
import com.generalgivers.foundation.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    private Path uploadPath;

    @PostConstruct
    public void init() {
        this.uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadPath);
            log.info("Upload directory initialized at: {}", this.uploadPath);
        } catch (IOException ex) {
            log.error("Could not create upload directory: {}", ex.getMessage());
            throw new RuntimeException("Could not create upload directory", ex);
        }
    }

    public String storeFile(MultipartFile file, ModuleType moduleType, UUID moduleId) {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "unknown");

        // Generate unique file name to avoid collisions
        String fileExtension = getFileExtension(originalFileName);
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

        try {
            // Check for invalid characters in file name
            if (originalFileName.contains("..")) {
                throw new RuntimeException("Invalid file path sequence in filename: " + originalFileName);
            }

            // Create module-specific subdirectory
            Path moduleDir = this.uploadPath.resolve(moduleType.name().toLowerCase());
            if (moduleId != null) {
                moduleDir = moduleDir.resolve(moduleId.toString());
            }
            Files.createDirectories(moduleDir);

            // Copy file to the target location
            Path targetLocation = moduleDir.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Return relative path for storage in database
            String relativePath = moduleType.name().toLowerCase() + "/" +
                    (moduleId != null ? moduleId.toString() + "/" : "") + uniqueFileName;

            log.info("File stored successfully: {}", relativePath);
            return relativePath;

        } catch (IOException ex) {
            log.error("Could not store file {}: {}", originalFileName, ex.getMessage());
            throw new RuntimeException("Could not store file " + originalFileName, ex);
        }
    }

    public Resource loadFileAsResource(String filePath) {
        try {
            Path file = this.uploadPath.resolve(filePath).normalize();
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File not found: " + filePath);
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("File not found: " + filePath);
        }
    }

    public void deleteFile(String filePath) {
        try {
            Path file = this.uploadPath.resolve(filePath).normalize();
            Files.deleteIfExists(file);
            log.info("File deleted successfully: {}", filePath);
        } catch (IOException ex) {
            log.error("Could not delete file {}: {}", filePath, ex.getMessage());
        }
    }

    public String getContentType(String filePath) {
        try {
            Path file = this.uploadPath.resolve(filePath).normalize();
            String contentType = Files.probeContentType(file);
            return contentType != null ? contentType : "application/octet-stream";
        } catch (IOException ex) {
            return "application/octet-stream";
        }
    }

    private String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex > 0) {
            return fileName.substring(lastDotIndex);
        }
        return "";
    }
}
