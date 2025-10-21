// src/main/java/com/fitnesstracker/userservice/dto/ProfileUpdateRequest.java

package main.java.com.fitnesstracker.userservice.dto;

// Data structure for profile updates (PUT API)
public class ProfileUpdateRequest {

    private String displayName;
    private String fitnessGoal;
    private String preferredActivity;

    // Getters and Setters (omitted for brevity)
    // ...
    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
    // ... (All other getters/setters)
}