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
public class ChildrenHomeNotificationService {

    private final UserRepository userRepository;
    private final MailerSendService mailerSendService;

    public void notifyChildrenHomeCreated(String homeName, String creatorName) {
        try {
            // Get organizing team members
            List<User> organizingUsers = userRepository.findByRoleInAndIsActiveTrue(
                List.of(UserRole.CHAIRPERSON, UserRole.VICE_CHAIRPERSON, 
                       UserRole.ORGANIZING_SECRETARY, UserRole.SECRETARY_GENERAL)
            );

            String subject = "New Children's Home Added - " + homeName;
            String content = String.format(
                "A new children's home \"%s\" has been added to the system by %s. " +
                "This home is now available for visit planning and tracking.",
                homeName, creatorName
            );

            for (User user : organizingUsers) {
                mailerSendService.sendNotificationEmail(
                    user.getEmail(),
                    user.getName(),
                    subject,
                    content
                );
            }

            log.info("Children's home created notifications sent to {} organizing users", organizingUsers.size());
        } catch (Exception e) {
            log.error("Failed to send children's home created notifications", e);
        }
    }

    public void notifyChildrenHomeUpdated(String homeName, String updaterName) {
        try {
            // Get organizing users for updates
            List<User> organizingUsers = userRepository.findByRoleInAndIsActiveTrue(
                List.of(UserRole.CHAIRPERSON, UserRole.ORGANIZING_SECRETARY)
            );

            String subject = "Children's Home Updated - " + homeName;
            String content = String.format(
                "Information for children's home \"%s\" has been updated by %s. " +
                "Please review the changes in the dashboard.",
                homeName, updaterName
            );

            for (User user : organizingUsers) {
                mailerSendService.sendNotificationEmail(
                    user.getEmail(),
                    user.getName(),
                    subject,
                    content
                );
            }

            log.info("Children's home updated notifications sent to {} organizing users", organizingUsers.size());
        } catch (Exception e) {
            log.error("Failed to send children's home updated notifications", e);
        }
    }

    public void notifyChildrenHomeDeleted(String homeName, String deleterName) {
        try {
            // Get admin users for deletions
            List<User> adminUsers = userRepository.findByRoleInAndIsActiveTrue(
                List.of(UserRole.SUPER_USER, UserRole.CHAIRPERSON)
            );

            String subject = "Children's Home Deleted - " + homeName;
            String content = String.format(
                "Children's home \"%s\" has been deleted from the system by %s. " +
                "This action has been logged for audit purposes.",
                homeName, deleterName
            );

            for (User user : adminUsers) {
                mailerSendService.sendNotificationEmail(
                    user.getEmail(),
                    user.getName(),
                    subject,
                    content
                );
            }

            log.info("Children's home deleted notifications sent to {} admin users", adminUsers.size());
        } catch (Exception e) {
            log.error("Failed to send children's home deleted notifications", e);
        }
    }
}