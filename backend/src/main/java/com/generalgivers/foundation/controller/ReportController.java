package com.generalgivers.foundation.controller;

import com.generalgivers.foundation.dto.report.MonthlyFundsReport;
import com.generalgivers.foundation.dto.report.ProjectProgressReport;
import com.generalgivers.foundation.dto.report.UserRoleReport;
import com.generalgivers.foundation.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Reports", description = "Reporting and analytics endpoints")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/funds-by-month")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'TREASURER')")
    @Operation(summary = "Get monthly funds report", description = "Get aggregated donations by month for a given year")
    public ResponseEntity<List<MonthlyFundsReport>> getMonthlyFundsReport(
            @RequestParam(defaultValue = "2025") int year) {
        return ResponseEntity.ok(reportService.getMonthlyFundsReport(year));
    }

    @GetMapping("/projects-progress")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'TREASURER')")
    @Operation(summary = "Get project progress report", description = "Get all projects with funding progress")
    public ResponseEntity<List<ProjectProgressReport>> getProjectProgressReport() {
        return ResponseEntity.ok(reportService.getProjectProgressReport());
    }

    @GetMapping("/users-roles")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON')")
    @Operation(summary = "Get user role statistics", description = "Get user count by role and active status")
    public ResponseEntity<List<UserRoleReport>> getUserRoleReport() {
        return ResponseEntity.ok(reportService.getUserRoleReport());
    }
}
