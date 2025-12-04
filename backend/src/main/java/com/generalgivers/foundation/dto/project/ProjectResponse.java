package com.generalgivers.foundation.dto.project;

import com.generalgivers.foundation.entity.ProjectStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse {
    private UUID id;
    private String title;
    private String description;
    private ProjectStatus status;
    private BigDecimal targetAmount;
    private BigDecimal fundsRaised;
    private Double percentFunded;
    private LocalDate startDate;
    private LocalDate endDate;
    private UUID createdById;
    private String createdByName;
    private LocalDateTime createdAt;
}
