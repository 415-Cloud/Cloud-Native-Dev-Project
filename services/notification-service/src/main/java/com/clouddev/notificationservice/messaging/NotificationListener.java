package com.clouddev.notificationservice.messaging;

import com.clouddev.notificationservice.model.NotificationEvent;
import com.clouddev.notificationservice.service.NotificationDispatcher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

@Component
public class NotificationListener {

    private static final Logger log = LoggerFactory.getLogger(NotificationListener.class);
    private final NotificationDispatcher dispatcher;

    public NotificationListener(NotificationDispatcher dispatcher) {
        this.dispatcher = dispatcher;
    }

    @RabbitListener(queues = "${notifications.queue:notifications.queue}")
    public void handleNotificationEvent(@Payload NotificationEvent event) {
        log.debug("Received notification event payload: {}", event);
        dispatcher.dispatch(event);
    }
}
