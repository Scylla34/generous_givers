package com.generalgivers.foundation.controller;

import com.generalgivers.foundation.dto.notification.NotificationResponse;
import com.generalgivers.foundation.entity.Notification;
import com.generalgivers.foundation.entity.User;
import com.generalgivers.foundation.repository.UserRepository;
import com.generalgivers.foundation.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Notifications", description = "Notification management endpoints")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Get notifications", description = "Get paginated notifications for current user")
    public ResponseEntity<Map<String, Object>> getNotifications(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        UUID userId = getUserIdFromAuth(authentication);
        Page<Notification> notificationPage = notificationService.getNotificationsForUser(userId, page, size);

        Map<String, Object> response = new HashMap<>();
        response.put("notifications", notificationPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList()));
        response.put("currentPage", notificationPage.getNumber());
        response.put("totalPages", notificationPage.getTotalPages());
        response.put("totalElements", notificationPage.getTotalElements());
        response.put("hasMore", notificationPage.hasNext());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/unread")
    @Operation(summary = "Get unread notifications", description = "Get all unread notifications for current user")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotifications(Authentication authentication) {
        UUID userId = getUserIdFromAuth(authentication);
        List<Notification> notifications = notificationService.getUnreadNotificationsForUser(userId);

        return ResponseEntity.ok(notifications.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList()));
    }

    @GetMapping("/unread/count")
    @Operation(summary = "Get unread count", description = "Get count of unread notifications")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication authentication) {
        UUID userId = getUserIdFromAuth(authentication);
        long count = notificationService.getUnreadCountForUser(userId);

        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark as read", description = "Mark a notification as read")
    public ResponseEntity<Void> markAsRead(@PathVariable UUID id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/read-all")
    @Operation(summary = "Mark all as read", description = "Mark all notifications as read for current user")
    public ResponseEntity<Void> markAllAsRead(Authentication authentication) {
        UUID userId = getUserIdFromAuth(authentication);
        notificationService.markAllAsReadForUser(userId);
        return ResponseEntity.ok().build();
    }

    private UUID getUserIdFromAuth(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .entityType(notification.getEntityType())
                .entityId(notification.getEntityId())
                .metadata(notification.getMetadata())
                .isRead(notification.getIsRead())
                .isGlobal(notification.getIsGlobal())
                .createdAt(notification.getCreatedAt())
                .readAt(notification.getReadAt())
                .build();
    }
}
