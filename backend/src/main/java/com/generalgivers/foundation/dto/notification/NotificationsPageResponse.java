package com.generalgivers.foundation.dto.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationsPageResponse {

    private List<NotificationResponse> notifications;
    private int currentPage;
    private int totalPages;
    private long totalElements;
    private boolean hasMore;
}