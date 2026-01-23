package com.generalgivers.foundation.controller;

import com.generalgivers.foundation.dto.common.ApiResponse;
import com.generalgivers.foundation.dto.report.MonthlyFundsReport;
import com.generalgivers.foundation.dto.report.ProjectProgressReport;
import com.generalgivers.foundation.dto.report.UserRoleReport;
import com.generalgivers.foundation.dto.report.UserReportDto;
import com.generalgivers.foundation.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'TREASURER', 'SECRETARY_GENERAL')")
    @Operation(summary = "Get monthly funds report", description = "Get aggregated donations by month for a given year")
    public ResponseEntity<ApiResponse<List<MonthlyFundsReport>>> getMonthlyFundsReport(
            @RequestParam(defaultValue = "2025") int year,
            Authentication authentication) {
        String userEmail = authentication.getName();
        List<MonthlyFundsReport> reports = reportService.getMonthlyFundsReport(year, userEmail);
        return ResponseEntity.ok(ApiResponse.success(
            "Monthly funds report generated successfully for year " + year, 
            reports
        ));
    }

    @GetMapping("/projects-progress")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'TREASURER', 'SECRETARY_GENERAL')")
    @Operation(summary = "Get project progress report", description = "Get all projects with funding progress")
    public ResponseEntity<ApiResponse<List<ProjectProgressReport>>> getProjectProgressReport(Authentication authentication) {
        String userEmail = authentication.getName();
        List<ProjectProgressReport> reports = reportService.getProjectProgressReport(userEmail);
        return ResponseEntity.ok(ApiResponse.success(
            "Project progress report generated successfully", 
            reports
        ));
    }

    @GetMapping("/users-roles")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL')")
    @Operation(summary = "Get user role statistics", description = "Get user count by role and active status")
    public ResponseEntity<ApiResponse<List<UserRoleReport>>> getUserRoleReport(Authentication authentication) {
        String userEmail = authentication.getName();
        List<UserRoleReport> reports = reportService.getUserRoleReport(userEmail);
        return ResponseEntity.ok(ApiResponse.success(
            "User role report generated successfully", 
            reports
        ));
    }

    @GetMapping("/users")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL')")
    @Operation(summary = "Get users report", description = "Get detailed report of all users with their roles and status")
    public ResponseEntity<ApiResponse<List<UserReportDto>>> getUsersReport(Authentication authentication) {
        String userEmail = authentication.getName();
        List<UserReportDto> reports = reportService.getUsersReport(userEmail);
        return ResponseEntity.ok(ApiResponse.success(
            "Users report generated successfully", 
            reports
        ));
    }

    @PostMapping("/export-notification")
    @PreAuthorize("hasAnyRole('SUPER_USER', 'CHAIRPERSON', 'TREASURER', 'SECRETARY_GENERAL')")
    @Operation(summary = "Notify data export", description = "Send notification about data export")
    public ResponseEntity<ApiResponse<Void>> notifyDataExport(
            @RequestParam String exportType,
            @RequestParam int recordCount,
            Authentication authentication) {
        String userEmail = authentication.getName();
        reportService.notifyDataExport(exportType, userEmail, recordCount);
        return ResponseEntity.ok(ApiResponse.success(
            "Export notification sent successfully for " + exportType + " with " + recordCount + " records", 
            null
        ));
    }
}

