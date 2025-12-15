package com.fitnesstracker.userservice.service;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.fitnesstracker.userservice.dto.ProfileUpdateRequest;
import com.fitnesstracker.userservice.dto.UserProfileDTO;
import com.fitnesstracker.userservice.model.UserProfile;
import com.fitnesstracker.userservice.repository.UserProfileRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProfileService Tests")
@SuppressWarnings("unused")
class ProfileServiceTest {

    @Mock
    private UserProfileRepository profileRepository;

    @InjectMocks
    private ProfileService profileService;

    private UserProfile testProfile;

    @BeforeEach
    void setUp() {
        testProfile = new UserProfile();
        testProfile.setUserId("user-123");
        testProfile.setEmail("test@example.com");
        testProfile.setName("Test User");
        testProfile.setProfileInfo("Test profile info");
        testProfile.setFitnessLevel("intermediate");
        testProfile.setGoals("Build muscle");
        testProfile.setMeasuringSystem("metric");
        testProfile.setCreatedAt(LocalDateTime.now());
        testProfile.setUpdatedAt(LocalDateTime.now());
    }

    @Nested
    @DisplayName("Create Profile Tests")
    class CreateProfileTests {

        @Test
        @DisplayName("Should create profile successfully")
        void shouldCreateProfileSuccessfully() {
            when(profileRepository.save(any(UserProfile.class))).thenReturn(testProfile);

            UserProfile result = profileService.createProfile(testProfile);

            assertNotNull(result);
            assertEquals("user-123", result.getUserId());
            assertEquals("test@example.com", result.getEmail());
            verify(profileRepository).save(testProfile);
        }

        @Test
        @DisplayName("Should throw exception when userId is null")
        void shouldThrowExceptionWhenUserIdIsNull() {
            UserProfile profile = new UserProfile();
            profile.setUserId(null);
            profile.setEmail("test@example.com");

            IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> profileService.createProfile(profile)
            );
            assertEquals("User ID and email are required for profile creation.", exception.getMessage());
        }

        @Test
        @DisplayName("Should throw exception when email is null")
        void shouldThrowExceptionWhenEmailIsNull() {
            UserProfile profile = new UserProfile();
            profile.setUserId("user-123");
            profile.setEmail(null);

            IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> profileService.createProfile(profile)
            );
            assertEquals("User ID and email are required for profile creation.", exception.getMessage());
        }
    }

    @Nested
    @DisplayName("Get Profile Tests")
    class GetProfileTests {

        @Test
        @DisplayName("Should return profile when user exists")
        void shouldReturnProfileWhenUserExists() {
            when(profileRepository.findById("user-123")).thenReturn(Optional.of(testProfile));

            Optional<UserProfileDTO> result = profileService.getProfile("user-123");

            assertTrue(result.isPresent());
            assertEquals("user-123", result.get().getUserId());
            assertEquals("test@example.com", result.get().getEmail());
            assertEquals("Test User", result.get().getName());
            assertEquals("intermediate", result.get().getFitnessLevel());
        }

        @Test
        @DisplayName("Should return empty when user does not exist")
        void shouldReturnEmptyWhenUserDoesNotExist() {
            when(profileRepository.findById("nonexistent")).thenReturn(Optional.empty());

            Optional<UserProfileDTO> result = profileService.getProfile("nonexistent");

            assertTrue(result.isEmpty());
        }
    }

    @Nested
    @DisplayName("Update Profile Tests")
    class UpdateProfileTests {

        @Test
        @DisplayName("Should update all fields when provided")
        void shouldUpdateAllFieldsWhenProvided() {
            ProfileUpdateRequest request = new ProfileUpdateRequest();
            request.setName("Updated Name");
            request.setProfileInfo("Updated info");
            request.setFitnessLevel("advanced");
            request.setGoals("Run marathon");
            request.setMeasuringSystem("imperial");

            when(profileRepository.findById("user-123")).thenReturn(Optional.of(testProfile));
            when(profileRepository.save(any(UserProfile.class))).thenAnswer(invocation -> invocation.getArgument(0));

            UserProfileDTO result = profileService.updateProfile("user-123", request);

            assertEquals("Updated Name", result.getName());
            assertEquals("Updated info", result.getProfileInfo());
            assertEquals("advanced", result.getFitnessLevel());
            assertEquals("Run marathon", result.getGoals());
            assertEquals("imperial", result.getMeasuringSystem());
        }

        @Test
        @DisplayName("Should only update provided fields")
        void shouldOnlyUpdateProvidedFields() {
            ProfileUpdateRequest request = new ProfileUpdateRequest();
            request.setName("Updated Name");

            when(profileRepository.findById("user-123")).thenReturn(Optional.of(testProfile));
            when(profileRepository.save(any(UserProfile.class))).thenAnswer(invocation -> invocation.getArgument(0));

            UserProfileDTO result = profileService.updateProfile("user-123", request);

            assertEquals("Updated Name", result.getName());
            assertEquals("Test profile info", result.getProfileInfo());
            assertEquals("intermediate", result.getFitnessLevel());
        }

        @Test
        @DisplayName("Should throw exception when user not found")
        void shouldThrowExceptionWhenUserNotFound() {
            ProfileUpdateRequest request = new ProfileUpdateRequest();
            request.setName("Updated Name");

            when(profileRepository.findById("nonexistent")).thenReturn(Optional.empty());

            RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> profileService.updateProfile("nonexistent", request)
            );
            assertEquals("User profile not found.", exception.getMessage());
        }

        @Test
        @DisplayName("Should save profile after update")
        void shouldSaveProfileAfterUpdate() {
            ProfileUpdateRequest request = new ProfileUpdateRequest();
            request.setGoals("New goals");

            when(profileRepository.findById("user-123")).thenReturn(Optional.of(testProfile));
            when(profileRepository.save(any(UserProfile.class))).thenAnswer(invocation -> invocation.getArgument(0));

            profileService.updateProfile("user-123", request);

            ArgumentCaptor<UserProfile> captor = ArgumentCaptor.forClass(UserProfile.class);
            verify(profileRepository).save(captor.capture());
            assertEquals("New goals", captor.getValue().getGoals());
        }
    }
}
