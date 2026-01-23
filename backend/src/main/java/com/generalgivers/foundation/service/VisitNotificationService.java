package com.generalgivers.foundation.service;

import com.generalgivers.foundation.entity.User;
import com.generalgivers.foundation.entity.UserRole;
import com.generalgivers.foundation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class VisitNotificationService {

    private final UserRepository userRepository;
    private final MailerSendService mailerSendService;

    public void notifyVisitRecorded(String location, String creatorName) {
        try {
            // Get all active users with organizing roles
            List<User> organizingUsers = userRepository.findByRoleInAndIsActiveTrue(
                List.of(UserRole.CHAIRPERSON, UserRole.VICE_CHAIRPERSON, 
                       UserRole.ORGANIZING_SECRETARY, UserRole.SECRETARY_GENERAL)
            );

            String subject = "New Visit Recorded - " + location;
            String content = String.format(
                "A new visit has been recorded by %s at %s. " +
                "Check the dashboard for more details and photos.",
                creatorName, location
            );

            for (User user : organizingUsers) {
                mailerSendService.sendNotificationEmail(
                    user.getEmail(),
                    user.getName(),
                    subject,
                    content
                );
            }

            log.info("Visit recorded notifications sent to {} organizing users", organizingUsers.size());
        } catch (Exception e) {
            log.error("Failed to send visit recorded notifications", e);
        }
    }

    public void notifyVisitUpdated(String location, String updaterName) {
        try {
            // Get organizing users for visit updates
            List<User> organizingUsers = userRepository.findByRoleInAndIsActiveTrue(
                List.of(UserRole.CHAIRPERSON, UserRole.ORGANIZING_SECRETARY)
            );

            String subject = "Visit Updated - " + location;
            String content = String.format(
                "Visit details for %s have been updated by %s. " +
                "Review the changes in the dashboard.",
                location, updaterName
            );

            for (User user : organizingUsers) {
                mailerSendService.sendNotificationEmail(
                    user.getEmail(),
                    user.getName(),
                    subject,
                    content
                );
            }

            log.info("Visit updated notifications sent to {} organizing users", organizingUsers.size());
        } catch (Exception e) {
            log.error("Failed to send visit updated notifications", e);
        }
    }

    public void notifyVisitDeleted(String location, String deleterName) {
        try {
            // Get admin users for visit deletions
            List<User> adminUsers = userRepository.findByRoleInAndIsActiveTrue(
                List.of(UserRole.SUPER_USER, UserRole.CHAIRPERSON)
            );

            String subject = "Visit Deleted - " + location;
            String content = String.format(
                "Visit record for %s has been deleted by %s. " +
                "This action has been logged for audit purposes.",
                location, deleterName
            );

            for (User user : adminUsers) {
                mailerSendService.sendNotificationEmail(
                    user.getEmail(),
                    user.getName(),
                    subject,
                    content
                );
            }

            log.info("Visit deleted notifications sent to {} admin users", adminUsers.size());
        } catch (Exception e) {
            log.error("Failed to send visit deleted notifications", e);
        }
    }
}