package com.generalgivers.foundation.dto.visit;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class VisitRequest {

    @NotNull(message = "Visit date is required")
    private LocalDate visitDate;

    private String location;

    private String city;

    private String town;

    private String village;

    private UUID childrenHomeId;

    private String notes;

    private List<String> participants;

    private List<String> photos;
}
