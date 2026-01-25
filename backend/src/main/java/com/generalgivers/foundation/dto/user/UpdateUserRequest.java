package com.generalgivers.foundation.dto.user;

import com.generalgivers.foundation.entity.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateUserRequest {

    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @Email(message = "Email must be valid")
    private String email;

    private String phone;

    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;

    private UserRole role; // Allow role change on edit

    private LocalDate memberJoiningDate; // Allow editing member joining date
}
