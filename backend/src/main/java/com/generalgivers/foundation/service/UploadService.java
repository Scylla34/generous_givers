package com.generalgivers.foundation.service;

import com.generalgivers.foundation.dto.upload.UploadResponse;
import com.generalgivers.foundation.entity.ModuleType;
import com.generalgivers.foundation.entity.Upload;
import com.generalgivers.foundation.entity.User;
import com.generalgivers.foundation.exception.ResourceNotFoundException;
import com.generalgivers.foundation.repository.UploadRepository;
import com.generalgivers.foundation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UploadService {

    private final UploadRepository uploadRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    @Transactional
    public UploadResponse uploadFile(MultipartFile file, ModuleType moduleType, UUID moduleId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String filePath = fileStorageService.storeFile(file, moduleType, moduleId);

        Upload upload = Upload.builder()
                .fileName(filePath.substring(filePath.lastIndexOf('/') + 1))
                .originalFileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .filePath(filePath)
                .moduleType(moduleType)
                .moduleId(moduleId)
                .uploadedBy(user)
                .build();

        Upload savedUpload = uploadRepository.save(upload);
        log.info("File uploaded successfully: {} by user: {}", file.getOriginalFilename(), userEmail);

        return mapToResponse(savedUpload);
    }

    @Transactional
    public List<UploadResponse> uploadMultipleFiles(List<MultipartFile> files, ModuleType moduleType, UUID moduleId, String userEmail) {
        return files.stream()
                .map(file -> uploadFile(file, moduleType, moduleId, userEmail))
                .collect(Collectors.toList());
    }

    public List<UploadResponse> getUploadsByModule(ModuleType moduleType, UUID moduleId) {
        List<Upload> uploads = uploadRepository.findByModuleTypeAndModuleIdOrderByCreatedAtDesc(moduleType, moduleId);
        return uploads.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<UploadResponse> getUploadsByModuleType(ModuleType moduleType) {
        List<Upload> uploads = uploadRepository.findByModuleTypeOrderByCreatedAtDesc(moduleType);
        return uploads.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public UploadResponse getUploadById(UUID id) {
        Upload upload = uploadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Upload not found with id: " + id));
        return mapToResponse(upload);
    }

    public Resource downloadFile(UUID id) {
        Upload upload = uploadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Upload not found with id: " + id));
        return fileStorageService.loadFileAsResource(upload.getFilePath());
    }

    public String getContentType(UUID id) {
        Upload upload = uploadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Upload not found with id: " + id));
        return fileStorageService.getContentType(upload.getFilePath());
    }

    public String getOriginalFileName(UUID id) {
        Upload upload = uploadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Upload not found with id: " + id));
        return upload.getOriginalFileName();
    }

    @Transactional
    public void deleteUpload(UUID id, String userEmail) {
        Upload upload = uploadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Upload not found with id: " + id));

        fileStorageService.deleteFile(upload.getFilePath());
        uploadRepository.delete(upload);
        log.info("File deleted: {} by user: {}", upload.getOriginalFileName(), userEmail);
    }

    @Transactional
    public void deleteUploadsByModule(ModuleType moduleType, UUID moduleId) {
        List<Upload> uploads = uploadRepository.findByModuleTypeAndModuleIdOrderByCreatedAtDesc(moduleType, moduleId);
        for (Upload upload : uploads) {
            fileStorageService.deleteFile(upload.getFilePath());
        }
        uploadRepository.deleteByModuleTypeAndModuleId(moduleType, moduleId);
        log.info("All uploads deleted for module: {} with id: {}", moduleType, moduleId);
    }

    private UploadResponse mapToResponse(Upload upload) {
        return UploadResponse.builder()
                .id(upload.getId())
                .fileName(upload.getFileName())
                .originalFileName(upload.getOriginalFileName())
                .fileType(upload.getFileType())
                .fileSize(upload.getFileSize())
                .fileUrl(baseUrl + "/api/v1/uploads/" + upload.getId() + "/download")
                .moduleType(upload.getModuleType())
                .moduleId(upload.getModuleId())
                .uploadedByName(upload.getUploadedBy() != null ?
                        upload.getUploadedBy().getFirstName() + " " + upload.getUploadedBy().getLastName() : null)
                .createdAt(upload.getCreatedAt())
                .build();
    }
}
