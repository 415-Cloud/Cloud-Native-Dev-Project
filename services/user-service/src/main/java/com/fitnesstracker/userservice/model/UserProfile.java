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

    // Getters and Setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getFitnessGoal() {
        return fitnessGoal;
    }

    public void setFitnessGoal(String fitnessGoal) {
        this.fitnessGoal = fitnessGoal;
    }

    public String getPreferredActivity() {
        return preferredActivity;
    }

    public void setPreferredActivity(String preferredActivity) {
        this.preferredActivity = preferredActivity;
    }

    public double getTotalDistance() {
        return totalDistance;
    }

    public void setTotalDistance(double totalDistance) {
        this.totalDistance = totalDistance;
    }

    public int getTotalWorkouts() {
        return totalWorkouts;
    }

    public void setTotalWorkouts(int totalWorkouts) {
        this.totalWorkouts = totalWorkouts;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}