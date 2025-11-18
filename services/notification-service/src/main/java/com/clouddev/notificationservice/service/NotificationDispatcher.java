package com.clouddev.notificationservice.service;

import com.clouddev.notificationservice.model.NotificationEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class NotificationDispatcher {

    private static final Logger log = LoggerFactory.getLogger(NotificationDispatcher.class);

    public void dispatch(NotificationEvent event) {
        log.info("Dispatching notification to user {} ({}): {}", event.username(), event.userId(), event.message());
        // Placeholder for email, SMS, or push integrations
    }
}
