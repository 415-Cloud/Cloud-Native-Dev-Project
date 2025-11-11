package com.clouddev.notificationservice.model;

import java.time.Instant;

public record NotificationEvent(
        String userId,
        String username,
        String message,
        Instant occurredAt
) {
}
