package com.generalgivers.foundation.service;

import com.generalgivers.foundation.dto.dashboard.DashboardStatsResponse;
import com.generalgivers.foundation.dto.dashboard.RecentActivityResponse;
import com.generalgivers.foundation.dto.dashboard.MonthlyChartData;
import com.generalgivers.foundation.entity.Project;
import com.generalgivers.foundation.entity.ProjectStatus;
import com.generalgivers.foundation.entity.User;
import com.generalgivers.foundation.repository.DonationRepository;
import com.generalgivers.foundation.repository.ProjectRepository;
import com.generalgivers.foundation.repository.UserRepository;
import com.generalgivers.foundation.repository.VisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProjectRepository projectRepository;
    private final DonationRepository donationRepository;
    private final UserRepository userRepository;
    private final VisitRepository visitRepository;

    public DashboardStatsResponse getDashboardStats() {
        // Get current counts
        long totalProjects = projectRepository.count();
        long activeProjects = projectRepository.countByStatus(ProjectStatus.ACTIVE);
        long completedProjects = projectRepository.countByStatus(ProjectStatus.COMPLETED);
        
        // Calculate total donations
        BigDecimal totalDonations = donationRepository.getTotalDonationAmount();
        if (totalDonations == null) {
            totalDonations = BigDecimal.ZERO;
        }
        
        // Get active users count
        long activeUsers = userRepository.countByIsActiveTrue();
        
        // Calculate monthly growth (simplified - comparing current month to previous)
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lastMonth = now.minusMonths(1);
        
        long currentMonthProjects = projectRepository.countByCreatedAtBetween(
            now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0),
            now
        );
        long lastMonthProjects = projectRepository.countByCreatedAtBetween(
            lastMonth.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0),
            lastMonth.withDayOfMonth(lastMonth.toLocalDate().lengthOfMonth()).withHour(23).withMinute(59).withSecond(59)
        );
        
        // Calculate percentage changes
        double projectsChange = calculatePercentageChange(lastMonthProjects, currentMonthProjects);
        double monthlyGrowth = calculateMonthlyGrowth();
        
        return DashboardStatsResponse.builder()
                .totalProjects((int) totalProjects)
                .activeProjects((int) activeProjects)
                .completedProjects((int) completedProjects)
                .totalDonations(totalDonations)
                .activeUsers((int) activeUsers)
                .monthlyGrowth(String.format("%.1f%%", monthlyGrowth))
                .projectsChange(String.format("%+.1f", projectsChange))
                .donationsChange("+12.5") // Simplified for now
                .usersChange("+8.3") // Simplified for now
                .build();
    }

    public List<RecentActivityResponse> getRecentActivities() {
        List<RecentActivityResponse> activities = new ArrayList<>();
        
        // Get recent projects
        List<Project> recentProjects = projectRepository.findTop3ByOrderByCreatedAtDesc();
        for (Project project : recentProjects) {
            activities.add(RecentActivityResponse.builder()
                    .id(project.getId().toString())
                    .type("project")
                    .title("New Project Created")
                    .description("Project '" + project.getTitle() + "' was added to the system")
                    .timestamp(project.getCreatedAt().toString())
                    .color("primary")
                    .build());
        }
        
        // Get recent users
        List<User> recentUsers = userRepository.findTop2ByOrderByCreatedAtDesc();
        for (User user : recentUsers) {
            activities.add(RecentActivityResponse.builder()
                    .id(user.getId().toString())
                    .type("user")
                    .title("New Member Joined")
                    .description(user.getName() + " joined as " + user.getRole().name())
                    .timestamp(user.getCreatedAt().toString())
                    .color("green")
                    .build());
        }
        
        // Sort by timestamp descending and limit to 5
        return activities.stream()
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .limit(5)
                .collect(Collectors.toList());
    }

    public List<MonthlyChartData> getMonthlyDonations() {
        // Get donations for the last 6 months
        List<MonthlyChartData> chartData = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        
        for (int i = 5; i >= 0; i--) {
            LocalDateTime monthStart = now.minusMonths(i).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
            LocalDateTime monthEnd = monthStart.withDayOfMonth(monthStart.toLocalDate().lengthOfMonth())
                    .withHour(23).withMinute(59).withSecond(59);
            
            BigDecimal monthlyTotal = donationRepository.getTotalDonationAmountBetween(monthStart, monthEnd);
            if (monthlyTotal == null) {
                monthlyTotal = BigDecimal.ZERO;
            }
            
            String monthName = monthStart.format(DateTimeFormatter.ofPattern("MMM"));
            
            chartData.add(MonthlyChartData.builder()
                    .month(monthName)
                    .amount(monthlyTotal.doubleValue())
                    .build());
        }
        
        return chartData;
    }

    public List<MonthlyChartData> getMonthlyProjects() {
        // Get project creation data for the last 6 months
        List<MonthlyChartData> chartData = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        
        for (int i = 5; i >= 0; i--) {
            LocalDateTime monthStart = now.minusMonths(i).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
            LocalDateTime monthEnd = monthStart.withDayOfMonth(monthStart.toLocalDate().lengthOfMonth())
                    .withHour(23).withMinute(59).withSecond(59);
            
            long monthlyProjects = projectRepository.countByCreatedAtBetween(monthStart, monthEnd);
            String monthName = monthStart.format(DateTimeFormatter.ofPattern("MMM"));
            
            chartData.add(MonthlyChartData.builder()
                    .month(monthName)
                    .projects((int) monthlyProjects)
                    .build());
        }
        
        return chartData;
    }

    private double calculatePercentageChange(long oldValue, long newValue) {
        if (oldValue == 0) {
            return newValue > 0 ? 100.0 : 0.0;
        }
        return ((double) (newValue - oldValue) / oldValue) * 100.0;
    }

    private double calculateMonthlyGrowth() {
        // Simplified calculation - in production this would be more sophisticated
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lastMonth = now.minusMonths(1);
        
        long currentMonthActivities = projectRepository.countByCreatedAtBetween(
            now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0),
            now
        ) + visitRepository.countByCreatedAtBetween(
            now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0),
            now
        );
        
        long lastMonthActivities = projectRepository.countByCreatedAtBetween(
            lastMonth.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0),
            lastMonth.withDayOfMonth(lastMonth.toLocalDate().lengthOfMonth()).withHour(23).withMinute(59).withSecond(59)
        ) + visitRepository.countByCreatedAtBetween(
            lastMonth.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0),
            lastMonth.withDayOfMonth(lastMonth.toLocalDate().lengthOfMonth()).withHour(23).withMinute(59).withSecond(59)
        );
        
        return calculatePercentageChange(lastMonthActivities, currentMonthActivities);
    }
}