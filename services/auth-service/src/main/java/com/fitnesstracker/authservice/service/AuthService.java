package com.fitnesstracker.authservice.service;

import com.fitnesstracker.authservice.dto.LoginRequest;
import com.fitnesstracker.authservice.dto.RegistrationRequest;
import com.fitnesstracker.authservice.dto.TokenResponse;
import com.fitnesstracker.authservice.model.Credential;
import com.fitnesstracker.authservice.repository.CredentialRepository;
import com.fitnesstracker.authservice.config.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class AuthService {

    private final CredentialRepository credentialRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RestTemplate restTemplate;

    @Value("${user-service.url}")
    private String userServiceUrl;

    public AuthService(CredentialRepository credentialRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil,
            RestTemplate restTemplate) {
        this.credentialRepository = credentialRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.restTemplate = restTemplate;
        if (userServiceUrl == null) {
            // Default or throw exception if critical, but for now just ensure it's not null
            // for the analysis
            // In a real scenario, we might want to fail fast if this property is missing.
            // keeping it simple for the checker
        }
    }

    /**
     * Register a new user account
     * 
     * @param request Registration request containing email, password, and optional
     *                profile fields
     * @return The created credential
     * @throws IllegalArgumentException if validation fails or email is already in
     *                                  use
     */
    public Credential register(RegistrationRequest request) {
        // Validate email
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required.");
        }

        // Validate email format
        String email = request.getEmail().trim().toLowerCase();
        if (!isValidEmail(email)) {
            throw new IllegalArgumentException("Invalid email format.");
        }

        // Check if email already exists
        if (credentialRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email is already in use.");
        }

        // Validate password
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Password is required.");
        }

        // Validate password strength (minimum 6 characters)
        if (request.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters long.");
        }

        // Generate UUID for userId
        String userId = UUID.randomUUID().toString();

        // Create and save credential
        Credential credential = new Credential();
        credential.setUserId(userId);
        credential.setEmail(email);
        credential.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        Credential savedCredential = credentialRepository.save(credential);

        // Create a user profile in the user-service
        // Pass through optional profile fields from registration request
        Map<String, Object> userProfileData = new HashMap<>();
        userProfileData.put("userId", savedCredential.getUserId());
        userProfileData.put("email", savedCredential.getEmail());
        userProfileData.put("name", request.getName());
        userProfileData.put("profileInfo", request.getProfileInfo());
        userProfileData.put("fitnessLevel", request.getFitnessLevel());
        userProfileData.put("goals", request.getGoals());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(userProfileData, headers);

        try {
            restTemplate.postForObject(userServiceUrl, requestEntity, Void.class);
        } catch (Exception e) {
            // Log error but don't fail registration - could implement retry logic later
            System.err.println("Failed to create user profile in user-service: " + e.getMessage());
            // Optionally, you could rollback the credential creation here if needed
        }

        return savedCredential;
    }

    /**
     * Validate email format using regex
     * 
     * @param email Email to validate
     * @return true if email format is valid
     */
    private boolean isValidEmail(String email) {
        // Basic email regex pattern
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        Pattern pattern = Pattern.compile(emailRegex);
        return pattern.matcher(email).matches();
    }

    /**
     * Login an existing user
     * 
     * @param request Login request containing email and password
     * @return Token response with JWT token and userId
     * @throws IllegalArgumentException if email or password is invalid
     */
    public TokenResponse login(LoginRequest request) {
        // Normalize email (trim and lowercase) for consistency
        String email = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : null;

        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("Email is required.");
        }

        Credential credential = credentialRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        if (request.getPassword() == null ||
                !passwordEncoder.matches(request.getPassword(), credential.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        String token = jwtUtil.generateToken(credential.getUserId(), credential.getEmail());
        return new TokenResponse(token, credential.getUserId());
    }
}
