package com.generalgivers.foundation.controller;

import com.generalgivers.foundation.dto.notification.NotificationResponse;
import com.generalgivers.foundation.dto.notification.NotificationsPageResponse;
import com.generalgivers.foundation.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Notifications", description = "Notification management endpoints")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Get paginated notifications", description = "Get notifications with pagination")
    public ResponseEntity<NotificationsPageResponse> getNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(notificationService.getUserNotifications(userEmail, page, size));
    }

    @GetMapping("/unread")
    @Operation(summary = "Get unread notifications", description = "Get all unread notifications for user")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotifications(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(notificationService.getUnreadNotifications(userEmail));
    }

    @GetMapping("/unread/count")
    @Operation(summary = "Get unread count", description = "Get count of unread notifications")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication authentication) {
        String userEmail = authentication.getName();
        long count = notificationService.getUnreadCount(userEmail);
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark notification as read", description = "Mark a specific notification as read")
    public ResponseEntity<Void> markAsRead(@PathVariable UUID id, Authentication authentication) {
        String userEmail = authentication.getName();
        notificationService.markAsRead(id, userEmail);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/read-all")
    @Operation(summary = "Mark all as read", description = "Mark all notifications as read for user")
    public ResponseEntity<Void> markAllAsRead(Authentication authentication) {
        String userEmail = authentication.getName();
        notificationService.markAllAsRead(userEmail);
        return ResponseEntity.ok().build();
    }
}