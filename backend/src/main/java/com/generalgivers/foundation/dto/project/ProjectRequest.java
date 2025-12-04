package com.generalgivers.foundation.dto.project;

import com.generalgivers.foundation.entity.ProjectStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ProjectRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    private String title;

    private String description;

    private ProjectStatus status;

    @PositiveOrZero(message = "Target amount must be zero or positive")
    private BigDecimal targetAmount;

    private LocalDate startDate;

    private LocalDate endDate;
}
