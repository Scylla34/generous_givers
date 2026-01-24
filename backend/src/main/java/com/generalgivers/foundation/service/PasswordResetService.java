package com.generalgivers.foundation.service;

import com.generalgivers.foundation.dto.auth.PasswordResetRequest;
import com.generalgivers.foundation.dto.auth.ResetPasswordRequest;
import com.generalgivers.foundation.entity.PasswordResetToken;
import com.generalgivers.foundation.entity.User;
import com.generalgivers.foundation.exception.ResourceNotFoundException;
import com.generalgivers.foundation.repository.PasswordResetTokenRepository;
import com.generalgivers.foundation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Transactional
    public void requestPasswordReset(PasswordResetRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        // Delete any existing tokens for this user
        tokenRepository.deleteByUserId(user.getId());

        // Generate secure token
        String token = generateSecureToken();
        
        // Create reset token (expires in 1 hour)
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiresAt(LocalDateTime.now().plusHours(1))
                .used(false)
                .build();

        tokenRepository.save(resetToken);

        // Send reset email
        try {
            emailService.sendPasswordResetEmail(
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                token
            );
            log.info("Password reset email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send password reset email: {}", e.getMessage());
            // Delete the token since email failed
            tokenRepository.delete(resetToken);
            throw new RuntimeException("Failed to send password reset email. Please check your email address and try again.");
        }
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new ResourceNotFoundException("Reset token", "token", request.getToken()));

        if (!resetToken.isValid()) {
            throw new IllegalArgumentException("Invalid or expired reset token");
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setMustChangePassword(false);
        userRepository.save(user);

        // Mark token as used
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);

        log.info("Password reset completed for user: {}", user.getEmail());
    }

    @Transactional
    public void cleanupExpiredTokens() {
        tokenRepository.deleteExpiredTokens(LocalDateTime.now());
        log.info("Cleaned up expired password reset tokens");
    }

    private String generateSecureToken() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}