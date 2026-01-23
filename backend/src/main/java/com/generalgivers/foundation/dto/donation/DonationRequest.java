package com.generalgivers.foundation.dto.donation;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DonationRequest {

    @NotBlank(message = "Donor name is required")
    private String donorName;

    @NotBlank(message = "Email is required")
    @Email(message = "Valid email is required")
    private String email;

    private String phoneNumber;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    @NotBlank(message = "Payment method is required")
    private String method;

    private UUID projectId;
}