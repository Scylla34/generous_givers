package com.generalgivers.foundation.dto.report;

import com.generalgivers.foundation.entity.ProjectStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectProgressReport {
    private UUID projectId;
    private String title;
    private ProjectStatus status;
    private BigDecimal targetAmount;
    private BigDecimal fundsRaised;
    private Double percentFunded;
    private long donationCount;
}
