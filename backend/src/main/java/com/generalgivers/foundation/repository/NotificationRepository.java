package com.generalgivers.foundation.repository;

import com.generalgivers.foundation.entity.Notification;
import com.generalgivers.foundation.entity.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId OR n.isGlobal = true ORDER BY n.createdAt DESC")
    Page<Notification> findByUserIdOrGlobal(@Param("userId") UUID userId, Pageable pageable);

    @Query("SELECT n FROM Notification n WHERE (n.user.id = :userId OR n.isGlobal = true) AND n.isRead = false ORDER BY n.createdAt DESC")
    List<Notification> findUnreadByUserIdOrGlobal(@Param("userId") UUID userId);

    @Query("SELECT COUNT(n) FROM Notification n WHERE (n.user.id = :userId OR n.isGlobal = true) AND n.isRead = false")
    long countUnreadByUserIdOrGlobal(@Param("userId") UUID userId);

    List<Notification> findByIsGlobalTrueOrderByCreatedAtDesc();

    List<Notification> findByTypeOrderByCreatedAtDesc(NotificationType type);

    @Query("SELECT n FROM Notification n WHERE n.entityType = :entityType AND n.entityId = :entityId")
    List<Notification> findByEntity(@Param("entityType") String entityType, @Param("entityId") UUID entityId);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.readAt = :readAt WHERE n.id = :id")
    void markAsRead(@Param("id") UUID id, @Param("readAt") LocalDateTime readAt);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.readAt = :readAt WHERE (n.user.id = :userId OR n.isGlobal = true) AND n.isRead = false")
    void markAllAsReadForUser(@Param("userId") UUID userId, @Param("readAt") LocalDateTime readAt);

    @Modifying
    @Query("DELETE FROM Notification n WHERE n.createdAt < :before")
    void deleteOlderThan(@Param("before") LocalDateTime before);
}
