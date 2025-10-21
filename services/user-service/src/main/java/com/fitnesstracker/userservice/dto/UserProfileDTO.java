// src/main/java/com/fitnesstracker/userservice/dto/UserProfileDTO.java

package main.java.com.fitnesstracker.userservice.dto;

// Data structure for profile responses (GET API)
public class UserProfileDTO {

    private String userId;
    private String email;
    private String username;
    private String displayName;
    private String fitnessGoal;
    private String preferredActivity;
    private double totalDistance;
    private int totalWorkouts;

    // Getters and Setters (omitted for brevity)
    // ...
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
    // ... (All other getters/setters)
}