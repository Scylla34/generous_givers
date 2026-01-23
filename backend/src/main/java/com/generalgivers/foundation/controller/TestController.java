package com.generalgivers.foundation.controller;

import com.generalgivers.foundation.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
public class TestController {

    private final EmailService emailService;

    @PostMapping("/email")
    public ResponseEntity<String> testEmail(@RequestParam String email) {
        try {
            emailService.sendUserCredentials(email, "Test", "User", "temp123");
            return ResponseEntity.ok("Email sent successfully to " + email);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Email failed: " + e.getMessage());
        }
    }
}