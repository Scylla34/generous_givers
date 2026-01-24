package com.generalgivers.foundation.controller;

import com.generalgivers.foundation.dto.contact.ContactRequest;
import com.generalgivers.foundation.service.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/contact")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Contact", description = "Contact form endpoints")
public class ContactController {

    private final EmailService emailService;

    @PostMapping
    @Operation(summary = "Submit contact form", description = "Submit a contact form message")
    public ResponseEntity<Map<String, String>> submitContactForm(@Valid @RequestBody ContactRequest request) {
        log.info("Received contact form submission from: {}", request.getEmail());

        try {
            // Send email to admin
            emailService.sendContactEmail(request);

            // Send confirmation to the sender
            emailService.sendContactConfirmation(request);

            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Thank you for your message. We will get back to you soon!"
            ));
        } catch (Exception e) {
            log.error("Failed to send contact form emails: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "status", "error",
                "message", "Failed to send your message. Please check your email address and try again."
            ));
        }
    }
}
