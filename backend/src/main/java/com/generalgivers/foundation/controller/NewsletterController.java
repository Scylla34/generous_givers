package com.generalgivers.foundation.controller;

import com.generalgivers.foundation.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/newsletter")
@RequiredArgsConstructor
@Slf4j
public class NewsletterController {

    private final EmailService emailService;

    @PostMapping("/subscribe")
    public ResponseEntity<String> subscribe(@RequestParam String email) {
        try {
            log.info("Newsletter subscription request from: {}", email);

            // Send welcome email to subscriber (synchronous - must succeed)
            emailService.sendNewsletterWelcomeSync(email);

            // TODO: Add to newsletter database/service

            return ResponseEntity.ok("Successfully subscribed to newsletter!");
        } catch (Exception e) {
            log.error("Failed to subscribe email: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to subscribe. Please check email configuration and try again.");
        }
    }
}