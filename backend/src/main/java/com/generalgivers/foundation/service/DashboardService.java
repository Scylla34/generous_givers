package com.generalgivers.foundation.service;

import com.generalgivers.foundation.dto.DashboardStatsDTO;
import com.generalgivers.foundation.dto.RecentActivityDTO;
import com.generalgivers.foundation.entity.DonationStatus;
import com.generalgivers.foundation.entity.ProjectStatus;
import com.generalgivers.foundation.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProjectRepository projectRepository;
    private final DonationRepository donationRepository;
    private final UserRepository userRepository;
    private final VisitRepository visitRepository;

    public DashboardStatsDTO getStats() {
        // Get total projects
        long totalProjects = projectRepository.count();

        // Get total donations (completed only)
        BigDecimal totalDonations = donationRepository.getTotalDonationsAmount();
        if (totalDonations == null) {
            totalDonations = BigDecimal.ZERO;
        }

        // Get active users (is_active = true)
        long activeUsers = userRepository.countByIsActive(true);

        // Calculate monthly growth (simple calculation for now)
        LocalDateTime lastMonth = LocalDateTime.now().minusMonths(1);
        long lastMonthDonationsCount = donationRepository
                .findByDateBetween(lastMonth, LocalDateTime.now())
                .size();

        String monthlyGrowth = calculateGrowthPercentage(lastMonthDonationsCount, totalDonations.intValue());

        // Calculate changes (mock data for now - can be improved)
        String projectsChange = "+2 this month";
        String donationsChange = "+12% from last month";
        String usersChange = "+3 new this week";

        return DashboardStatsDTO.builder()
                .totalProjects(totalProjects)
                .totalDonations(totalDonations)
                .activeUsers(activeUsers)
                .monthlyGrowth(monthlyGrowth)
                .projectsChange(projectsChange)
                .donationsChange(donationsChange)
                .usersChange(usersChange)
                .build();
    }

    public List<RecentActivityDTO> getRecentActivities() {
        List<RecentActivityDTO> activities = new ArrayList<>();

        // Get recent donations (last 3)
        var recentDonations = donationRepository.findAllOrderByDateDesc()
                .stream()
                .limit(3)
                .toList();

        for (var donation : recentDonations) {
            activities.add(RecentActivityDTO.builder()
                    .id(donation.getId().toString())
                    .type("donation")
                    .title("New donation received")
                    .description(String.format("$%.2f from %s",
                            donation.getAmount(),
                            donation.getDonorName() != null ? donation.getDonorName() : "Anonymous"))
                    .timestamp(donation.getDate())
                    .color("green")
                    .build());
        }

        // Get recent projects (last 2)
        var recentProjects = projectRepository.findAllOrderByCreatedAtDesc()
                .stream()
                .limit(2)
                .toList();

        for (var project : recentProjects) {
            String statusText = project.getStatus() == ProjectStatus.COMPLETED ? "completed" : "started";
            activities.add(RecentActivityDTO.builder()
                    .id(project.getId().toString())
                    .type("project")
                    .title("Project " + statusText)
                    .description(project.getTitle())
                    .timestamp(project.getCreatedAt())
                    .color("blue")
                    .build());
        }

        // Get recent visits (last 2)
        var recentVisits = visitRepository.findAllOrderByVisitDateDesc()
                .stream()
                .limit(2)
                .toList();

        for (var visit : recentVisits) {
            activities.add(RecentActivityDTO.builder()
                    .id(visit.getId().toString())
                    .type("visit")
                    .title("Visit recorded")
                    .description(visit.getChildrenHome().getName())
                    .timestamp(visit.getVisitDate().atStartOfDay())
                    .color("purple")
                    .build());
        }

        // Sort by timestamp descending
        activities.sort((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()));

        // Return top 5
        return activities.stream().limit(5).toList();
    }

    private String calculateGrowthPercentage(long current, long total) {
        if (total == 0) return "0%";
        double percentage = ((double) current / total) * 100;
        return String.format("%.1f%%", percentage);
    }
}
