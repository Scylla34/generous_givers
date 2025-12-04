package com.generalgivers.foundation.dto.childrenhome;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChildrenHomeResponse {
    private UUID id;
    private String name;
    private String location;
    private String contact;
    private String notes;
    private LocalDateTime createdAt;
}
