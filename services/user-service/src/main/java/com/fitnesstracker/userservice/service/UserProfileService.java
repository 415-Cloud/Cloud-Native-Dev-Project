package com.fitnesstracker.userservice.service;

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

    public Optional<UserProfile> getUserProfileById(String userId) {
        return userProfileRepository.findById(userId);
    }
}