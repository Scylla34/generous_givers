package com.generalgivers.foundation.dto.visit;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VisitResponse {
    private UUID id;
    private LocalDate visitDate;
    private String location;
    private String city;
    private String town;
    private String village;
    private UUID childrenHomeId;
    private String childrenHomeName;
    private String notes;
    private List<String> participants;
    private UUID createdById;
    private String createdByName;
    private List<String> photos;
    private LocalDateTime createdAt;
}
