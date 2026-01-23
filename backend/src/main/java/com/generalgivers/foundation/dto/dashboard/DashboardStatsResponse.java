package com.generalgivers.foundation.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private int totalProjects;
    private int activeProjects;
    private int completedProjects;
    private BigDecimal totalDonations;
    private int activeUsers;
    private String monthlyGrowth;
    private String projectsChange;
    private String donationsChange;
    private String usersChange;
}