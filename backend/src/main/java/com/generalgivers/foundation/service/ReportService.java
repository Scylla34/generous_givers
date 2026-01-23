package com.generalgivers.foundation.service;

import com.generalgivers.foundation.dto.report.MonthlyFundsReport;
import com.generalgivers.foundation.dto.report.ProjectProgressReport;
import com.generalgivers.foundation.dto.report.UserRoleReport;
import com.generalgivers.foundation.dto.report.UserReportDto;
import com.generalgivers.foundation.entity.Project;
import com.generalgivers.foundation.entity.User;
import com.generalgivers.foundation.entity.UserRole;
import com.generalgivers.foundation.exception.ResourceNotFoundException;
import com.generalgivers.foundation.exception.ReportGenerationException;
import com.generalgivers.foundation.repository.DonationRepository;
import com.generalgivers.foundation.repository.ProjectRepository;
import com.generalgivers.foundation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {

    private final DonationRepository donationRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ReportNotificationService reportNotificationService;

    public List<MonthlyFundsReport> getMonthlyFundsReport(int year, String userEmail) {
        try {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

            List<MonthlyFundsReport> reports = new ArrayList<>();
            
            List<Object[]> results = donationRepository.getMonthlyDonationsForYear(year);
            
            for (Object[] result : results) {
                java.sql.Timestamp timestamp = (java.sql.Timestamp) result[0];
                BigDecimal total = (BigDecimal) result[1];

                java.time.LocalDateTime dateTime = timestamp.toLocalDateTime();

                reports.add(MonthlyFundsReport.builder()
                        .month(dateTime.getMonthValue())
                        .year(dateTime.getYear())
                        .totalAmount(total)
                        .donationCount(0L)
                        .build());
            }

            try {
                // Email notifications disabled for reports
                log.info("Monthly Funds Report generated for user: {}", user.getName());
            } catch (Exception e) {
                log.warn("Failed to log report generation: {}", e.getMessage());
            }

            return reports;
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error generating monthly funds report: {}", e.getMessage(), e);
            throw new ReportGenerationException("Failed to generate monthly funds report: " + e.getMessage());
        }
    }

    public List<ProjectProgressReport> getProjectProgressReport(String userEmail) {
        try {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

            List<Project> projects = projectRepository.findAll();

            List<ProjectProgressReport> reports = projects.stream()
                    .map(project -> {
                        try {
                            long donationCount = donationRepository.findByProjectId(project.getId()).size();
                            Double percentFunded = calculatePercentFunded(project.getFundsRaised(), project.getTargetAmount());

                            return ProjectProgressReport.builder()
                                    .projectId(project.getId())
                                    .title(project.getTitle())
                                    .status(project.getStatus())
                                    .targetAmount(project.getTargetAmount())
                                    .fundsRaised(project.getFundsRaised())
                                    .percentFunded(percentFunded)
                                    .donationCount(donationCount)
                                    .build();
                        } catch (Exception e) {
                            log.warn("Error processing project {}: {}", project.getId(), e.getMessage());
                            return null;
                        }
                    })
                    .filter(report -> report != null)
                    .collect(Collectors.toList());

            try {
                // Email notifications disabled for reports
                log.info("Project Progress Report generated for user: {}", user.getName());
            } catch (Exception e) {
                log.warn("Failed to log report generation: {}", e.getMessage());
            }

            return reports;
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error generating project progress report: {}", e.getMessage(), e);
            throw new ReportGenerationException("Failed to generate project progress report: " + e.getMessage());
        }
    }

    public List<UserRoleReport> getUserRoleReport(String userEmail) {
        try {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

            List<UserRoleReport> reports = new ArrayList<>();

            for (UserRole role : UserRole.values()) {
                long activeCount = userRepository.findByRole(role).stream()
                        .filter(u -> u.getIsActive()).count();
                long inactiveCount = userRepository.findByRole(role).stream()
                        .filter(u -> !u.getIsActive()).count();

                reports.add(UserRoleReport.builder()
                        .role(role)
                        .activeCount(activeCount)
                        .inactiveCount(inactiveCount)
                        .totalCount(activeCount + inactiveCount)
                        .build());
            }

            try {
                // Email notifications disabled for reports
                log.info("User Role Report generated for user: {}", user.getName());
            } catch (Exception e) {
                log.warn("Failed to log report generation: {}", e.getMessage());
            }

            return reports;
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error generating user role report: {}", e.getMessage(), e);
            throw new ReportGenerationException("Failed to generate user role report: " + e.getMessage());
        }
    }

    public List<UserReportDto> getUsersReport(String userEmail) {
        try {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

            List<UserReportDto> reports = userRepository.findAll().stream()
                    .map(u -> {
                        try {
                            return UserReportDto.builder()
                                    .id(u.getId().toString())
                                    .name(u.getName())
                                    .email(u.getEmail())
                                    .phone(u.getPhone())
                                    .role(u.getRole())
                                    .isActive(u.getIsActive())
                                    .createdAt(u.getCreatedAt())
                                    .build();
                        } catch (Exception e) {
                            log.warn("Error processing user {}: {}", u.getId(), e.getMessage());
                            return null;
                        }
                    })
                    .filter(report -> report != null)
                    .collect(Collectors.toList());

            try {
                // Email notifications disabled for reports
                log.info("Users Report generated for user: {}", user.getName());
            } catch (Exception e) {
                log.warn("Failed to log report generation: {}", e.getMessage());
            }

            return reports;
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error generating users report: {}", e.getMessage(), e);
            throw new ReportGenerationException("Failed to generate users report: " + e.getMessage());
        }
    }

    public void notifyDataExport(String exportType, String userEmail, int recordCount) {
        try {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

            // Email notifications disabled for reports
            log.info("Data export notification for type: {}, user: {}, records: {}", exportType, user.getName(), recordCount);
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error processing data export notification: {}", e.getMessage(), e);
            throw new ReportGenerationException("Failed to process export notification: " + e.getMessage());
        }
    }

    private Double calculatePercentFunded(BigDecimal fundsRaised, BigDecimal targetAmount) {
        if (targetAmount == null || targetAmount.compareTo(BigDecimal.ZERO) == 0) {
            return 0.0;
        }
        return fundsRaised.divide(targetAmount, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();
    }
}
