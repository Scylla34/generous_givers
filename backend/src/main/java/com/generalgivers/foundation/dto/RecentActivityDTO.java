package com.generalgivers.foundation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentActivityDTO {
    private String id;
    private String type; // donation, project, visit
    private String title;
    private String description;
    private LocalDateTime timestamp;
    private String color;
}
