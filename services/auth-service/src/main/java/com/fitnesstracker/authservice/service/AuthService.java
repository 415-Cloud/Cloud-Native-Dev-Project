package com.fitnesstracker.authservice.service;

import com.fitnesstracker.authservice.dto.LoginRequest;
import com.fitnesstracker.authservice.dto.RegistrationRequest;
import com.fitnesstracker.authservice.dto.TokenResponse;
import com.fitnesstracker.authservice.model.Credential;
import com.fitnesstracker.authservice.repository.CredentialRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final CredentialRepository credentialRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;
    private final UserServiceExternal userServiceExternal;

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
        if (credentialRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use.");
        }

        // 2. Generate unique user ID
        String userId = UUID.randomUUID().toString();

        // 3. Create and save the credential record
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        Credential credential = new Credential(userId, request.getEmail(), hashedPassword);

        Credential newCredential = credentialRepository.save(credential);

        // 4. Call the external User Service to create the profile
        userServiceExternal.createProfile(newCredential.getUserId(), newCredential.getEmail(),
                newCredential.getPasswordHash(), request);

        return newCredential;
    }

    // =====================================
    // LOGIN
    // =====================================
    public TokenResponse login(LoginRequest request) {
        // 1. Fetch credentials by email
        Optional<Credential> credentialOpt = credentialRepository.findByEmail(request.getEmail());

        if (credentialOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        Credential credential = credentialOpt.get();

        // 2. Compare the provided password with the stored hash
        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                credential.getPasswordHash());

        if (!passwordMatches) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        // 3. Generate JWT
        String token = jwtTokenService.generateToken(credential.getUserId(), credential.getEmail());

        return new TokenResponse(token, credential.getUserId());
    }
}