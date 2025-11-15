package com.fitnesstracker.userservice.controller;

import com.fitnesstracker.userservice.dto.ProfileUpdateRequest;
import com.fitnesstracker.userservice.dto.UserProfileDTO;
import com.fitnesstracker.userservice.model.UserProfile;
import com.fitnesstracker.userservice.service.ProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/users")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    // ===========================================
    // 1. PUBLIC/AUTHENTICATED API ENDPOINTS (GET/PUT)
    // ===========================================

    // API to fetch a user's profile data
    // Requires JWT authentication (configured in WebSecurityConfig)
    @GetMapping("/{userId}")
    public ResponseEntity<UserProfileDTO> getProfile(@PathVariable String userId, Principal principal) {
        // IMPORTANT SECURITY CHECK: Ensure the token's user ID matches the requested
        // path variable
        // In a full implementation, you'd get the current user ID from the Principal
        // object
        String authenticatedUserId = principal.getName(); // Assumes JWT filter sets Principal name to userId
        if (!authenticatedUserId.equals(userId)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN); // 403 Forbidden
        }

        return profileService.getProfile(userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND)); // 404 Not Found
    }

    // API to update a user's profile data (goals, preferences)
    // Requires JWT authentication
    @PutMapping("/{userId}")
    public ResponseEntity<UserProfileDTO> updateProfile(@PathVariable String userId,
            @RequestBody ProfileUpdateRequest request, Principal principal) {
        String authenticatedUserId = principal.getName();
        if (!authenticatedUserId.equals(userId)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        try {
            UserProfileDTO updatedProfile = profileService.updateProfile(userId, request);
            return ResponseEntity.ok(updatedProfile); // 200 OK
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404
        }
    }

    // ===========================================
    // 2. INTERNAL API ENDPOINT (CALLED BY AUTH-SERVICE)
    // ===========================================

    // Internal endpoint called by Auth Service during registration.
    // DOES NOT require JWT authentication (configured in WebSecurityConfig to
    // permitAll)
    @PostMapping("/create")
    public ResponseEntity<Void> createProfileFromAuthService(@RequestBody UserProfile profile) {
        try {
            profileService.createProfile(profile);
            return new ResponseEntity<>(HttpStatus.CREATED); // 201 Created
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // 400
        } catch (Exception e) {
            // Catches database errors (e.g., if a profile already exists for that ID)
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 500
        }
    }
}
