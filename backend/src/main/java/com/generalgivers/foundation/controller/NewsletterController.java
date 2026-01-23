package com.generalgivers.foundation.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/newsletter")
@RequiredArgsConstructor
@Slf4j
public class NewsletterController {

    @PostMapping("/subscribe")
    public ResponseEntity<String> subscribe(@RequestParam String email) {
        try {
            // For now, just log the subscription
            log.info("Newsletter subscription request from: {}", email);
            
            // TODO: Add to newsletter database/service
            
            return ResponseEntity.ok("Successfully subscribed to newsletter!");
        } catch (Exception e) {
            log.error("Failed to subscribe email: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to subscribe. Please try again.");
        }
    }
}