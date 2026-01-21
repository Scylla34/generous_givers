package com.generalgivers.foundation.dto.mpesa;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class MpesaPaymentRequest {
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^(254|0)?(7|1)[0-9]{8}$", message = "Invalid phone number format")
    private String phoneNumber;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than 0")
    private BigDecimal amount;

    private String donorName;

    private String email;

    private UUID projectId;

    private String accountReference;

    /**
     * Normalize phone number to 254 format
     */
    public String getNormalizedPhoneNumber() {
        String phone = phoneNumber.replaceAll("[^0-9]", "");
        if (phone.startsWith("0")) {
            phone = "254" + phone.substring(1);
        } else if (!phone.startsWith("254")) {
            phone = "254" + phone;
        }
        return phone;
    }
}
