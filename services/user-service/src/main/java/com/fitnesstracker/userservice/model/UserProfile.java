// src/main/java/com/fitnesstracker/userservice/model/UserProfile.java

package main.java.com.fitnesstracker.userservice.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_profiles") // Dedicated table for profile data
public class UserProfile {

    // IMPORTANT: userId is the canonical ID, managed by the Auth Service's
    // Credential table
    @Id
    private String userId;

    @Column(nullable = false)
    private String email;

    @Column(unique = true, nullable = false)
    private String username;

    private String displayName;

    // Core Profile Fields for the AI-lite Coach Service
    @Column(nullable = false)
    private String fitnessGoal; // e.g., 'Weight Loss', 'Endurance'

    @Column(nullable = false)
    private String preferredActivity; // e.g., 'Running', 'Cycling'

    // Profile metadata
    private double totalDistance = 0.0;
    private int totalWorkouts = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Constructors and Getters/Setters (omitted for brevity)
    // ...
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
    // ... (All other getters/setters)
}