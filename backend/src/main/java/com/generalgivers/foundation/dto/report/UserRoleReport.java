package com.generalgivers.foundation.dto.report;

import com.generalgivers.foundation.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRoleReport {
    private UserRole role;
    private long activeCount;
    private long inactiveCount;
    private long totalCount;
}
