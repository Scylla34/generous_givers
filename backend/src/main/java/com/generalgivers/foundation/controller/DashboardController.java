package com.generalgivers.foundation.controller;

import com.generalgivers.foundation.dto.dashboard.DashboardStatsResponse;
import com.generalgivers.foundation.dto.dashboard.MonthlyChartData;
import com.generalgivers.foundation.dto.dashboard.RecentActivityResponse;
import com.generalgivers.foundation.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Dashboard", description = "Dashboard data endpoints")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL', 'VICE_CHAIRPERSON', 'TREASURER', 'VICE_SECRETARY', 'ORGANIZING_SECRETARY', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Get dashboard statistics", description = "Get overview statistics for the dashboard")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    @GetMapping("/activities")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL', 'VICE_CHAIRPERSON', 'TREASURER', 'VICE_SECRETARY', 'ORGANIZING_SECRETARY', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Get recent activities", description = "Get recent activities for the dashboard")
    public ResponseEntity<List<RecentActivityResponse>> getRecentActivities() {
        return ResponseEntity.ok(dashboardService.getRecentActivities());
    }

    @GetMapping("/donations-chart")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL', 'VICE_CHAIRPERSON', 'TREASURER', 'VICE_SECRETARY', 'ORGANIZING_SECRETARY', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Get monthly donations chart data", description = "Get monthly donations data for charts")
    public ResponseEntity<List<MonthlyChartData>> getMonthlyDonations() {
        return ResponseEntity.ok(dashboardService.getMonthlyDonations());
    }

    @GetMapping("/projects-chart")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL', 'VICE_CHAIRPERSON', 'TREASURER', 'VICE_SECRETARY', 'ORGANIZING_SECRETARY', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Get monthly projects chart data", description = "Get monthly projects data for charts")
    public ResponseEntity<List<MonthlyChartData>> getMonthlyProjects() {
        return ResponseEntity.ok(dashboardService.getMonthlyProjects());
    }
}