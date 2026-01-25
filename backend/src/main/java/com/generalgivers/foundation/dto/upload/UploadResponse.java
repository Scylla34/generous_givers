package com.generalgivers.foundation.dto.upload;

import com.generalgivers.foundation.entity.ModuleType;
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
public class UploadResponse {
    private UUID id;
    private String fileName;
    private String originalFileName;
    private String fileType;
    private Long fileSize;
    private String fileUrl;
    private ModuleType moduleType;
    private UUID moduleId;
    private String uploadedByName;
    private LocalDateTime createdAt;
}
