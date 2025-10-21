// src/main/java/com/fitnesstracker/authservice/dto/RegistrationRequest.java

package com.fitnesstracker.authservice.dto;

// This DTO carries the data from the UI to the service layer for registration
public class RegistrationRequest {

    private String email;
    private String username;
    private String password;
    // Include initial profile data needed by the User Service for creation
    private String fitnessGoal;
    private String preferredActivity;

    // Getters and Setters (omitted for brevity)
    // ...
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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
    // ...
}