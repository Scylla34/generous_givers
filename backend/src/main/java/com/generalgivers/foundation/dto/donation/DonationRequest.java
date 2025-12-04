package com.generalgivers.foundation.dto.donation;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class DonationRequest {

    private String donorName;

    @Email(message = "Email must be valid")
    private String email;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    private String method;

    private UUID projectId;
}
