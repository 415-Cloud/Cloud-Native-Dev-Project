package com.fitnesstracker.userservice.controller;

import com.fitnesstracker.userservice.model.UserProfile;
import com.fitnesstracker.userservice.service.UserProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.fitnesstracker.userservice.dto.CreateUserProfileRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @PostMapping
    public ResponseEntity<UserProfile> createUserProfile(@RequestBody CreateUserProfileRequest request) {
        UserProfile newUserProfile = userProfileService.createUserProfile(request);
        return new ResponseEntity<>(newUserProfile, HttpStatus.CREATED);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserProfile> getUserProfile(@PathVariable String userId) {
        return userProfileService.getUserProfileById(userId)
                .map(userProfile -> new ResponseEntity<>(userProfile, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}