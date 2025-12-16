package com.fitnesstracker.userservice.service;

import com.fitnesstracker.userservice.dto.CreateUserProfileRequest;
import com.fitnesstracker.userservice.model.UserProfile;
import com.fitnesstracker.userservice.repository.UserProfileRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;

    public UserProfileService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    public UserProfile createUserProfile(@org.springframework.lang.NonNull CreateUserProfileRequest request) {
        UserProfile userProfile = new UserProfile();
        userProfile.setUserId(request.getUserId());
        userProfile.setEmail(request.getEmail());
        userProfile.setPasswordHash(request.getPassword()); // temporary, will be replaced with password encoding
        return userProfileRepository.save(userProfile);
    }

    public Optional<UserProfile> getUserProfileById(@org.springframework.lang.NonNull String userId) {
        return userProfileRepository.findById(userId);
    }
}