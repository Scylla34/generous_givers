package com.generalgivers.foundation.config;

import com.generalgivers.foundation.entity.User;
import com.generalgivers.foundation.entity.UserRole;
import com.generalgivers.foundation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initializeDefaultAdminUser();
    }

    private void initializeDefaultAdminUser() {
        String adminEmail = "admin@generalgivers.org";

        if (userRepository.existsByEmail(adminEmail)) {
            log.info("Default admin user already exists");
            return;
        }

        User admin = User.builder()
                .name("System Administrator")
                .email(adminEmail)
                .passwordHash(passwordEncoder.encode("Admin@123"))
                .phone("+1234567890")
                .role(UserRole.SUPER_USER)
                .isActive(true)
                .mustChangePassword(false)
                .build();

        userRepository.save(admin);
        log.info("Default admin user created successfully");
        log.info("Email: admin@generalgivers.org");
        log.info("Password: Admin@123");
        log.info("Please change the password after first login in production!");
    }
}
