package com.generalgivers.foundation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private Long totalProjects;
    private BigDecimal totalDonations;
    private Long activeUsers;
    private String monthlyGrowth;
    private String projectsChange;
    private String donationsChange;
    private String usersChange;
}
