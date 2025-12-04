package com.generalgivers.foundation.dto.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyFundsReport {
    private int month;
    private int year;
    private BigDecimal totalAmount;
    private long donationCount;
}
