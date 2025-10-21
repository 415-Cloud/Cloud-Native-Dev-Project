// src/main/java/com/fitnesstracker/authservice/service/AuthService.java

package com.fitnesstracker.authservice.service;

import com.fitnesstracker.authservice.dto.LoginRequest;
import com.fitnesstracker.authservice.dto.RegistrationRequest;
import com.fitnesstracker.authservice.dto.TokenResponse;
import com.fitnesstracker.authservice.model.Credential;
import com.fitnesstracker.authservice.repository.CredentialRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final CredentialRepository credentialRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;
    private final UserServiceExternal userServiceExternal; // The new external dependency

    public AuthService(CredentialRepository credentialRepository, PasswordEncoder passwordEncoder,
            JwtTokenService jwtTokenService, UserServiceExternal userServiceExternal) {
        this.credentialRepository = credentialRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenService = jwtTokenService;
        this.userServiceExternal = userServiceExternal;
    }

    // =====================================
    // REGISTRATION
    // =====================================
    public Credential register(RegistrationRequest request) {
        // 1. Check for existing user
        if (credentialRepository.findByUsername(request.getUsername()).isPresent() ||
                credentialRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Username or email already in use.");
        }

        // 2. Create and save the credential record
        Credential credential = new Credential();
        credential.setEmail(request.getEmail());
        credential.setUsername(request.getUsername());

        // Hash the password securely
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        credential.setPasswordHash(hashedPassword);

        Credential newCredential = credentialRepository.save(credential);

        // 3. Call the external User Service to create the profile
        userServiceExternal.createProfile(newCredential.getUserId(), request);

        return newCredential;
    }

    // =====================================
    // LOGIN
    // =====================================
    public TokenResponse login(LoginRequest request) {
        // 1. Fetch credentials by username
        Optional<Credential> credentialOpt = credentialRepository.findByUsername(request.getUsername());

        if (credentialOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid username or password.");
        }

        Credential credential = credentialOpt.get();

        // 2. Compare the provided password with the stored hash
        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                credential.getPasswordHash());

        if (!passwordMatches) {
            throw new IllegalArgumentException("Invalid username or password.");
        }

        // 3. Generate JWT
        String token = jwtTokenService.generateToken(credential.getUserId(), credential.getUsername());

        return new TokenResponse(token, credential.getUserId());
    }
}