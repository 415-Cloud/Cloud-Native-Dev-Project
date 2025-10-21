// src/main/java/com/fitnesstracker/authservice/dto/LoginRequest.java

package com.fitnesstracker.authservice.dto;

// This DTO carries the data from the UI to the service layer for login
public class LoginRequest {

    private String username;
    private String password;

    // Getters and Setters (omitted for brevity)
    // ...
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
    // ...
}