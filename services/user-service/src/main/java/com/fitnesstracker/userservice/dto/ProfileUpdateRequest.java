package com.fitnesstracker.userservice.dto;

// Data structure for profile updates (PUT API)
public class ProfileUpdateRequest {

    private String name;
    private String profileInfo;
    private String fitnessLevel;
    private String goals;
    private String measuringSystem;

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProfileInfo() {
        return profileInfo;
    }

    public void setProfileInfo(String profileInfo) {
        this.profileInfo = profileInfo;
    }

    public String getFitnessLevel() {
        return fitnessLevel;
    }

    public void setFitnessLevel(String fitnessLevel) {
        this.fitnessLevel = fitnessLevel;
    }

    public String getGoals() {
        return goals;
    }

    public void setGoals(String goals) {
        this.goals = goals;
    }

    public String getMeasuringSystem() {
        return measuringSystem;
    }

    public void setMeasuringSystem(String measuringSystem) {
        this.measuringSystem = measuringSystem;
    }
}
