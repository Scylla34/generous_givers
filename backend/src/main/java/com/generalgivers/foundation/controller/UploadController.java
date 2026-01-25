package com.generalgivers.foundation.controller;

import com.generalgivers.foundation.dto.common.ApiResponse;
import com.generalgivers.foundation.dto.upload.UploadResponse;
import com.generalgivers.foundation.entity.ModuleType;
import com.generalgivers.foundation.service.UploadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/uploads")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Uploads", description = "File upload management endpoints")
public class UploadController {

    private final UploadService uploadService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL', 'VICE_CHAIRPERSON', 'TREASURER', 'VICE_SECRETARY', 'ORGANIZING_SECRETARY', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Upload a file", description = "Upload a single file linked to a module")
    public ResponseEntity<ApiResponse<UploadResponse>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("moduleType") ModuleType moduleType,
            @RequestParam(value = "moduleId", required = false) UUID moduleId,
            Authentication authentication) {
        String userEmail = authentication.getName();
        UploadResponse response = uploadService.uploadFile(file, moduleType, moduleId, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("File uploaded successfully", response));
    }

    @PostMapping(value = "/multiple", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL', 'VICE_CHAIRPERSON', 'TREASURER', 'VICE_SECRETARY', 'ORGANIZING_SECRETARY', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Upload multiple files", description = "Upload multiple files linked to a module")
    public ResponseEntity<ApiResponse<List<UploadResponse>>> uploadMultipleFiles(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("moduleType") ModuleType moduleType,
            @RequestParam(value = "moduleId", required = false) UUID moduleId,
            Authentication authentication) {
        String userEmail = authentication.getName();
        List<UploadResponse> responses = uploadService.uploadMultipleFiles(files, moduleType, moduleId, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Files uploaded successfully", responses));
    }

    @GetMapping("/module/{moduleType}/{moduleId}")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL', 'VICE_CHAIRPERSON', 'TREASURER', 'VICE_SECRETARY', 'ORGANIZING_SECRETARY', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Get uploads by module", description = "Get all uploads for a specific module instance")
    public ResponseEntity<ApiResponse<List<UploadResponse>>> getUploadsByModule(
            @PathVariable ModuleType moduleType,
            @PathVariable UUID moduleId) {
        List<UploadResponse> uploads = uploadService.getUploadsByModule(moduleType, moduleId);
        return ResponseEntity.ok(ApiResponse.success("Uploads retrieved successfully", uploads));
    }

    @GetMapping("/module/{moduleType}")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL', 'VICE_CHAIRPERSON', 'TREASURER', 'VICE_SECRETARY', 'ORGANIZING_SECRETARY', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Get uploads by module type", description = "Get all uploads for a module type")
    public ResponseEntity<ApiResponse<List<UploadResponse>>> getUploadsByModuleType(
            @PathVariable ModuleType moduleType) {
        List<UploadResponse> uploads = uploadService.getUploadsByModuleType(moduleType);
        return ResponseEntity.ok(ApiResponse.success("Uploads retrieved successfully", uploads));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL', 'VICE_CHAIRPERSON', 'TREASURER', 'VICE_SECRETARY', 'ORGANIZING_SECRETARY', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Get upload by ID", description = "Get upload details by ID")
    public ResponseEntity<ApiResponse<UploadResponse>> getUploadById(@PathVariable UUID id) {
        UploadResponse upload = uploadService.getUploadById(id);
        return ResponseEntity.ok(ApiResponse.success("Upload retrieved successfully", upload));
    }

    @GetMapping("/{id}/download")
    @Operation(summary = "Download file", description = "Download a file by upload ID")
    public ResponseEntity<Resource> downloadFile(@PathVariable UUID id) {
        Resource resource = uploadService.downloadFile(id);
        String contentType = uploadService.getContentType(id);
        String originalFileName = uploadService.getOriginalFileName(id);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + originalFileName + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL')")
    @Operation(summary = "Delete upload", description = "Delete an uploaded file")
    public ResponseEntity<ApiResponse<Void>> deleteUpload(
            @PathVariable UUID id,
            Authentication authentication) {
        String userEmail = authentication.getName();
        uploadService.deleteUpload(id, userEmail);
        return ResponseEntity.ok(ApiResponse.success("File deleted successfully", null));
    }
}
