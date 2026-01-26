package com.generalgivers.foundation.repository;

import com.generalgivers.foundation.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {

    @Query("SELECT e FROM Event e WHERE e.startDateTime >= :startDate AND e.startDateTime < :endDate ORDER BY e.startDateTime")
    List<Event> findEventsBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT e FROM Event e WHERE e.startDateTime >= :now AND e.startDateTime <= :reminderTime AND e.reminderSent = false")
    List<Event> findEventsNeedingReminders(@Param("now") LocalDateTime now, @Param("reminderTime") LocalDateTime reminderTime);

    @Query("SELECT e FROM Event e WHERE e.createdBy.id = :userId ORDER BY e.startDateTime")
    List<Event> findByCreatedById(@Param("userId") UUID userId);
}