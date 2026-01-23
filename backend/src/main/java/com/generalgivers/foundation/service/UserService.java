package com.generalgivers.foundation.service;

import com.generalgivers.foundation.dto.user.CreateUserRequest;
import com.generalgivers.foundation.dto.user.UpdateUserRequest;
import com.generalgivers.foundation.dto.user.UserResponse;
import com.generalgivers.foundation.entity.NotificationType;
import com.generalgivers.foundation.entity.User;
import com.generalgivers.foundation.entity.UserRole;
import com.generalgivers.foundation.exception.DuplicateResourceException;
import com.generalgivers.foundation.exception.ResourceNotFoundException;
import com.generalgivers.foundation.repository.UserRepository;
import com.generalgivers.foundation.util.PasswordGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final NotificationService notificationService;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return mapToUserResponse(user);
    }

    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return mapToUserResponse(user);
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User", "email", request.getEmail());
        }

        // Generate temporary password
        String temporaryPassword = PasswordGenerator.generateTemporaryPassword();
        
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(temporaryPassword))
                .phone(request.getPhone())
                .role(request.getRole())
                .memberJoiningDate(request.getMemberJoiningDate())
                .isActive(true)
                .mustChangePassword(true) // Force password change on first login
                .build();

        user = userRepository.save(user);
        
        // Send credentials via email - REQUIRED for user creation
        try {
            emailService.sendUserCredentials(
                user.getEmail(), 
                user.getFirstName(), 
                user.getLastName(), 
                temporaryPassword
            );
            log.info("User credentials sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send user credentials email: {}", e.getMessage());
            // Delete the created user since email failed
            userRepository.delete(user);
            throw new RuntimeException("User creation failed: Unable to send credentials email to " + user.getEmail() + ". Error: " + e.getMessage());
        }
        
        // Create notification for admin users
        try {
            String notificationMessage = String.format("New user %s %s has been created and notified via email.", 
                user.getFirstName(), user.getLastName());
            
            // Send notification to all admin users
            List<User> adminUsers = userRepository.findByRoleIn(
                List.of(UserRole.SUPER_USER, UserRole.CHAIRPERSON, UserRole.SECRETARY_GENERAL)
            );
            
            for (User adminUser : adminUsers) {
                notificationService.createUserNotification(
                    "New User Created",
                    notificationMessage,
                    NotificationType.USER_REGISTERED,
                    adminUser.getId()
                );
            }
        } catch (Exception e) {
            log.error("Failed to create user creation notification: {}", e.getMessage());
        }
        
        UserResponse response = mapToUserResponse(user);
        response.setTemporaryPassword(temporaryPassword);
        
        return response;
    }

    @Transactional
    public UserResponse updateUser(UUID id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        if (request.getName() != null) {
            // Split name into first and last name if provided
            String[] nameParts = request.getName().trim().split("\\s+", 2);
            user.setFirstName(nameParts[0]);
            user.setLastName(nameParts.length > 1 ? nameParts[1] : "");
        }

        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new DuplicateResourceException("User", "email", request.getEmail());
            }
            user.setEmail(request.getEmail());
        }

        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }

        if (request.getPassword() != null) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }

        user = userRepository.save(user);
        return mapToUserResponse(user);
    }

    @Transactional
    public UserResponse updateUserRole(UUID id, UserRole role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        user.setRole(role);
        user = userRepository.save(user);
        return mapToUserResponse(user);
    }

    @Transactional
    public void deactivateUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        user.setIsActive(false);
        userRepository.save(user);
    }

    public List<UserResponse> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role).stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .name(user.getName()) // Computed full name
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .mustChangePassword(user.getMustChangePassword())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
