package com.generalgivers.foundation.dto.event;

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
public class EventResponse {

    private UUID id;
    private String title;
    private String description;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private String colorCategory;
    private Integer reminderMinutes;
    private Boolean reminderSent;
    private UUID createdById;
    private String createdByName;
    private LocalDateTime createdAt;
}