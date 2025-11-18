<<<<<<<< HEAD:services/auth-service/src/main/java/com/fitnesstracker/authservice/AuthServiceApplication.java
package com.fitnesstracker.authservice;
========
package com.clouddev.notificationservice;
>>>>>>>> feature/notification-service:services/notification-service/src/main/java/com/clouddev/notificationservice/NotificationServiceApplication.java

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
<<<<<<<< HEAD:services/auth-service/src/main/java/com/fitnesstracker/authservice/AuthServiceApplication.java
public class AuthServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
========
public class NotificationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(NotificationServiceApplication.class, args);
>>>>>>>> feature/notification-service:services/notification-service/src/main/java/com/clouddev/notificationservice/NotificationServiceApplication.java
    }
}