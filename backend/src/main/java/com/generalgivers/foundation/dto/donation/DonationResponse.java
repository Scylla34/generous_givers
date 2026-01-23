package com.generalgivers.foundation.dto.donation;

import com.generalgivers.foundation.entity.DonationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DonationResponse {

    private UUID id;
    private UUID donorUserId;
    private String donorName;
    private String email;
    private BigDecimal amount;
    private LocalDateTime date;
    private String method;
    private DonationStatus status;
    private UUID projectId;
    private String projectTitle;
    private LocalDateTime createdAt;
}