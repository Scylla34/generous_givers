package com.generalgivers.foundation.service;

import com.generalgivers.foundation.entity.User;
import com.generalgivers.foundation.entity.UserRole;
import com.generalgivers.foundation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DonationNotificationService {

    private final UserRepository userRepository;
    private final MailerSendService mailerSendService;

    public void notifyDonationReceived(String donorName, BigDecimal amount, String projectTitle) {
        try {
            List<User> adminUsers = userRepository.findByRoleInAndIsActiveTrue(
                List.of(UserRole.SUPER_USER, UserRole.CHAIRPERSON, UserRole.TREASURER)
            );

            String subject = "New Donation Received - $" + amount;
            String content = String.format(
                "A new donation of $%s has been received from %s%s. " +
                "Thank you for supporting our mission!",
                amount, donorName, 
                projectTitle != null ? " for project: " + projectTitle : ""
            );

            for (User user : adminUsers) {
                mailerSendService.sendNotificationEmail(
                    user.getEmail(),
                    user.getName(),
                    subject,
                    content
                );
            }

            log.info("Donation received notifications sent to {} admin users", adminUsers.size());
        } catch (Exception e) {
            log.error("Failed to send donation received notifications", e);
        }
    }
}