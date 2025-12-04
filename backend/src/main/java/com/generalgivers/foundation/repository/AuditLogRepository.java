package com.generalgivers.foundation.repository;

import com.generalgivers.foundation.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByUserId(UUID userId);

    List<AuditLog> findByEntity(String entity);

    List<AuditLog> findByEntityAndEntityId(String entity, UUID entityId);

    List<AuditLog> findByTimestampBetween(LocalDateTime startTime, LocalDateTime endTime);

    List<AuditLog> findTop100ByOrderByTimestampDesc();
}
