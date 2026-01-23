package com.generalgivers.foundation.service;

import com.generalgivers.foundation.dto.notification.NotificationResponse;
import com.generalgivers.foundation.dto.notification.NotificationsPageResponse;
import com.generalgivers.foundation.entity.Notification;
import com.generalgivers.foundation.entity.NotificationType;
import com.generalgivers.foundation.entity.User;
import com.generalgivers.foundation.repository.NotificationRepository;
import com.generalgivers.foundation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationsPageResponse getUserNotifications(String userEmail, int page, int size) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        Page<Notification> notificationPage = getNotificationsForUser(user.getId(), page, size);
        
        List<NotificationResponse> notifications = notificationPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        
        return NotificationsPageResponse.builder()
                .notifications(notifications)
                .currentPage(page)
                .totalPages(notificationPage.getTotalPages())
                .totalElements(notificationPage.getTotalElements())
                .hasMore(notificationPage.hasNext())
                .build();
    }

    public List<NotificationResponse> getUnreadNotifications(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        return getUnreadNotificationsForUser(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        return getUnreadCountForUser(user.getId());
    }

    public void markAsRead(UUID notificationId, String userEmail) {
        markAsRead(notificationId);
    }

    public void markAllAsRead(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        markAllAsReadForUser(user.getId());
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

    public Page<Notification> getNotificationsForUser(UUID userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return notificationRepository.findByUserIdOrGlobal(userId, pageable);
    }
    public List<Notification> getUnreadNotificationsForUser(UUID userId) {
        return notificationRepository.findUnreadByUserIdOrGlobal(userId);
    }

    public long getUnreadCountForUser(UUID userId) {
        return notificationRepository.countUnreadByUserIdOrGlobal(userId);
    }

    @Transactional
    public void markAsRead(UUID notificationId) {
        notificationRepository.markAsRead(notificationId, LocalDateTime.now());
    }

    @Transactional
    public void markAllAsReadForUser(UUID userId) {
        notificationRepository.markAllAsReadForUser(userId, LocalDateTime.now());
    }

    @Transactional
    public Notification createNotification(String title, String message, NotificationType type,
                                           String entityType, UUID entityId, Map<String, Object> metadata,
                                           UUID userId, boolean isGlobal) {
        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }

        Notification notification = Notification.builder()
                .title(title)
                .message(message)
                .type(type)
                .entityType(entityType)
                .entityId(entityId)
                .metadata(metadata)
                .user(user)
                .isGlobal(isGlobal)
                .build();

        notification = notificationRepository.save(notification);
        log.info("Created notification: {} for type: {}", notification.getId(), type);
        return notification;
    }

    @Transactional
    public Notification createGlobalNotification(String title, String message, NotificationType type,
                                                 String entityType, String entityId) {
        Map<String, Object> metadata = entityId != null ? Map.of("entityId", entityId) : null;
        return createNotification(title, message, type, entityType, 
                entityId != null ? UUID.fromString(entityId) : null, metadata, null, true);
    }

    @Transactional
    public Notification createGlobalNotification(String title, String message, NotificationType type) {
        return createNotification(title, message, type, null, null, null, null, true);
    }

    @Transactional
    public Notification createUserNotification(String title, String message, NotificationType type, UUID userId) {
        return createNotification(title, message, type, null, null, null, userId, false);
    }

    public void notifyDonationReceived(String donorName, BigDecimal amount, String projectTitle) {
        String title = "New Donation Received";
        String message = String.format("%s donated KES %,.2f%s",
                donorName != null ? donorName : "Anonymous",
                amount,
                projectTitle != null ? " to " + projectTitle : "");

        createGlobalNotification(title, message, NotificationType.DONATION_RECEIVED);
    }

    public void notifyDonationCompleted(String donorName, BigDecimal amount, String mpesaReceipt, UUID donationId) {
        String title = "Donation Payment Completed";
        String message = String.format("Payment confirmed from %s for KES %,.2f. Receipt: %s",
                donorName != null ? donorName : "Anonymous",
                amount,
                mpesaReceipt != null ? mpesaReceipt : "N/A");

        Map<String, Object> metadata = Map.of(
                "donationId", donationId.toString(),
                "mpesaReceipt", mpesaReceipt != null ? mpesaReceipt : ""
        );

        createNotification(title, message, NotificationType.DONATION_COMPLETED,
                "DONATION", donationId, metadata, null, true);
    }

    public void notifyDonationFailed(String donorName, BigDecimal amount, String reason) {
        String title = "Donation Payment Failed";
        String message = String.format("Payment from %s for KES %,.2f failed: %s",
                donorName != null ? donorName : "Anonymous",
                amount,
                reason != null ? reason : "Unknown reason");

        createGlobalNotification(title, message, NotificationType.DONATION_FAILED);
    }

    public void notifyProjectCreated(String projectTitle, UUID projectId) {
        String title = "New Project Created";
        String message = String.format("Project '%s' has been created", projectTitle);

        Map<String, Object> metadata = Map.of("projectId", projectId.toString());

        createNotification(title, message, NotificationType.PROJECT_CREATED,
                "PROJECT", projectId, metadata, null, true);
    }

    public void notifyProjectCompleted(String projectTitle, UUID projectId) {
        String title = "Project Completed";
        String message = String.format("Project '%s' has been marked as completed", projectTitle);

        Map<String, Object> metadata = Map.of("projectId", projectId.toString());

        createNotification(title, message, NotificationType.PROJECT_COMPLETED,
                "PROJECT", projectId, metadata, null, true);
    }

    public void notifyVisitScheduled(String homeName, LocalDateTime visitDate, UUID visitId) {
        String title = "Visit Scheduled";
        String message = String.format("Visit to %s scheduled for %s",
                homeName,
                visitDate.toLocalDate().toString());

        Map<String, Object> metadata = Map.of("visitId", visitId.toString());

        createNotification(title, message, NotificationType.VISIT_SCHEDULED,
                "VISIT", visitId, metadata, null, true);
    }

    @Transactional
    public void deleteOldNotifications(int daysOld) {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(daysOld);
        notificationRepository.deleteOlderThan(cutoff);
        log.info("Deleted notifications older than {} days", daysOld);
    }
}
