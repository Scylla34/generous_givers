package com.generalgivers.foundation.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentActivityResponse {
    private String id;
    private String type;
    private String title;
    private String description;
    private String timestamp;
    private String color;
}