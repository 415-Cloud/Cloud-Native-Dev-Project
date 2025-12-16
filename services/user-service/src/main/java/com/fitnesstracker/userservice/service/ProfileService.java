package com.fitnesstracker.userservice.service;

import com.fitnesstracker.userservice.dto.ProfileUpdateRequest;
import com.fitnesstracker.userservice.dto.UserProfileDTO;
import com.fitnesstracker.userservice.model.UserProfile;
import com.fitnesstracker.userservice.repository.UserProfileRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProfileService {

    private final UserProfileRepository profileRepository;

    public ProfileService(UserProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    /**
     * Internal API for the Auth Service to create a new profile record.
     */
    public UserProfile createProfile(@org.springframework.lang.NonNull UserProfile newProfile) {
        // Simple data validation for required fields
        if (newProfile.getUserId() == null || newProfile.getEmail() == null) {
            throw new IllegalArgumentException("User ID and email are required for profile creation.");
        }
        return profileRepository.save(newProfile);
    }

    /**
     * Public API to fetch a profile by ID.
     */
    public Optional<UserProfileDTO> getProfile(@org.springframework.lang.NonNull String userId) {
        return profileRepository.findById(userId)
                .map(this::convertToDto);
    }

    /**
     * Public API to update a profile's goals and preferences.
     */
    public UserProfileDTO updateProfile(@org.springframework.lang.NonNull String userId,
            @org.springframework.lang.NonNull ProfileUpdateRequest request) {
        UserProfile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User profile not found."));

        // Update fields only if they are provided in the request
        if (request.getName() != null) {
            profile.setName(request.getName());
        }
        if (request.getProfileInfo() != null) {
            profile.setProfileInfo(request.getProfileInfo());
        }
        if (request.getFitnessLevel() != null) {
            profile.setFitnessLevel(request.getFitnessLevel());
        }
        if (request.getGoals() != null) {
            profile.setGoals(request.getGoals());
        }
        if (request.getMeasuringSystem() != null) {
            profile.setMeasuringSystem(request.getMeasuringSystem());
        }

        // Save and convert to DTO
        return convertToDto(profileRepository.save(profile));
    }

    // Helper method to map the JPA entity to a DTO for API responses
    private UserProfileDTO convertToDto(@org.springframework.lang.NonNull UserProfile profile) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setUserId(profile.getUserId());
        dto.setEmail(profile.getEmail());
        dto.setName(profile.getName());
        dto.setProfileInfo(profile.getProfileInfo());
        dto.setFitnessLevel(profile.getFitnessLevel());
        dto.setGoals(profile.getGoals());
        dto.setMeasuringSystem(profile.getMeasuringSystem());
        dto.setCreatedAt(profile.getCreatedAt());
        dto.setUpdatedAt(profile.getUpdatedAt());
        return dto;
    }

    public java.util.Map<String, String> getUsernames(java.util.List<String> userIds) {
        java.util.List<UserProfile> profiles = profileRepository.findByUserIdIn(userIds);
        java.util.Map<String, String> nameMap = new java.util.HashMap<>();
        for (UserProfile profile : profiles) {
            if (profile.getName() != null) {
                nameMap.put(profile.getUserId(), profile.getName());
            }
        }
        return nameMap;
    }
}
