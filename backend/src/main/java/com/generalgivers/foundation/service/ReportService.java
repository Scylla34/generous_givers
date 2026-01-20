package com.generalgivers.foundation.service;

import com.generalgivers.foundation.dto.report.MonthlyFundsReport;
import com.generalgivers.foundation.dto.report.ProjectProgressReport;
import com.generalgivers.foundation.dto.report.UserRoleReport;
import com.generalgivers.foundation.dto.report.UserReportDto;
import com.generalgivers.foundation.entity.Project;
import com.generalgivers.foundation.entity.User;
import com.generalgivers.foundation.entity.UserRole;
import com.generalgivers.foundation.repository.DonationRepository;
import com.generalgivers.foundation.repository.ProjectRepository;
import com.generalgivers.foundation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final DonationRepository donationRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public List<MonthlyFundsReport> getMonthlyFundsReport(int year) {
        List<Object[]> results = donationRepository.getMonthlyDonationsForYear(year);
        List<MonthlyFundsReport> reports = new ArrayList<>();

        for (Object[] result : results) {
            java.sql.Timestamp timestamp = (java.sql.Timestamp) result[0];
            BigDecimal total = (BigDecimal) result[1];

            java.time.LocalDateTime dateTime = timestamp.toLocalDateTime();

            reports.add(MonthlyFundsReport.builder()
                    .month(dateTime.getMonthValue())
                    .year(dateTime.getYear())
                    .totalAmount(total)
                    .donationCount(0L) // Can be enhanced with count query
                    .build());
        }

        return reports;
    }

    public List<ProjectProgressReport> getProjectProgressReport() {
        List<Project> projects = projectRepository.findAll();

        return projects.stream()
                .map(project -> {
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
                })
                .collect(Collectors.toList());
    }

    public List<UserRoleReport> getUserRoleReport() {
        List<UserRoleReport> reports = new ArrayList<>();

        for (UserRole role : UserRole.values()) {
            long activeCount = userRepository.findByRole(role).stream()
                    .filter(user -> user.getIsActive()).count();
            long inactiveCount = userRepository.findByRole(role).stream()
                    .filter(user -> !user.getIsActive()).count();

            reports.add(UserRoleReport.builder()
                    .role(role)
                    .activeCount(activeCount)
                    .inactiveCount(inactiveCount)
                    .totalCount(activeCount + inactiveCount)
                    .build());
        }

        return reports;
    }

    public List<UserReportDto> getUsersReport() {
        return userRepository.findAll().stream()
                .map(user -> UserReportDto.builder()
                        .id(user.getId().toString())
                        .name(user.getName())
                        .email(user.getEmail())
                        .phone(user.getPhone())
                        .role(user.getRole())
                        .isActive(user.getIsActive())
                        .createdAt(user.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
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
