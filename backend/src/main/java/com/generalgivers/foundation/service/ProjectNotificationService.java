package com.generalgivers.foundation.service;

import com.generalgivers.foundation.entity.NotificationType;
import com.generalgivers.foundation.entity.User;
import com.generalgivers.foundation.entity.UserRole;
import com.generalgivers.foundation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectNotificationService {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public void notifyProjectCreated(String projectTitle, String createdBy) {
        // Notify all admin users about new project
        List<User> adminUsers = userRepository.findByRoleIn(
            List.of(UserRole.SUPER_USER, UserRole.CHAIRPERSON, UserRole.SECRETARY_GENERAL)
        );
        
        String title = "New Project Created";
        String message = String.format("Project '%s' has been created by %s", projectTitle, createdBy);
        
        for (User admin : adminUsers) {
            notificationService.createUserNotification(
                title,
                message,
                NotificationType.PROJECT_CREATED,
                admin.getId()
            );
        }
        
        log.info("Project creation notifications sent to {} admin users", adminUsers.size());
    }

    public void notifyProjectUpdated(String projectTitle, String updatedBy) {
        // Notify project managers and admins
        List<User> notifyUsers = userRepository.findByRoleIn(
            List.of(UserRole.SUPER_USER, UserRole.CHAIRPERSON, UserRole.SECRETARY_GENERAL, UserRole.ORGANIZING_SECRETARY)
        );
        
        String title = "Project Updated";
        String message = String.format("Project '%s' has been updated by %s", projectTitle, updatedBy);
        
        for (User user : notifyUsers) {
            notificationService.createUserNotification(
                title,
                message,
                NotificationType.PROJECT_UPDATED,
                user.getId()
            );
        }
        
        log.info("Project update notifications sent to {} users", notifyUsers.size());
    }

    public void notifyProjectCompleted(String projectTitle) {
        // Notify all users about project completion
        List<User> allUsers = userRepository.findByIsActiveTrue();
        
        String title = "Project Completed! 🎉";
        String message = String.format("Great news! Project '%s' has been successfully completed. Thank you for your support!", projectTitle);
        
        for (User user : allUsers) {
            notificationService.createUserNotification(
                title,
                message,
                NotificationType.PROJECT_COMPLETED,
                user.getId()
            );
        }
        
        log.info("Project completion notifications sent to {} users", allUsers.size());
    }

    public void notifyProjectDeleted(String projectTitle, String deletedBy) {
        // Notify admin users about project deletion
        List<User> adminUsers = userRepository.findByRoleIn(
            List.of(UserRole.SUPER_USER, UserRole.CHAIRPERSON)
        );
        
        String title = "Project Deleted";
        String message = String.format("Project '%s' has been deleted by %s", projectTitle, deletedBy);
        
        for (User admin : adminUsers) {
            notificationService.createUserNotification(
                title,
                message,
                NotificationType.PROJECT_DELETED,
                admin.getId()
            );
        }
        
        log.info("Project deletion notifications sent to {} admin users", adminUsers.size());
    }
}