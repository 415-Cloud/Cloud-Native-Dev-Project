// src/main/java/com/fitnesstracker/authservice/dto/TokenResponse.java

package com.fitnesstracker.authservice.dto;

// This DTO is the response body returned to the client on successful login
public class TokenResponse {

    private String accessToken;
    private String tokenType = "Bearer";
    private String userId;

    public TokenResponse(String accessToken, String userId) {
        this.accessToken = accessToken;
        this.userId = userId;
    }

    // Getters and Setters (omitted for brevity)
    // ...
    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
    // ...
}