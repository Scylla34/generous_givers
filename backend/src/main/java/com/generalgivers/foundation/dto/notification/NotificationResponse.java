package com.generalgivers.foundation.dto.notification;

import com.generalgivers.foundation.entity.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {

    private UUID id;
    private String title;
    private String message;
    private NotificationType type;
    private String entityType;
    private UUID entityId;
    private Map<String, Object> metadata;
    private boolean isRead;
    private boolean isGlobal;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
}