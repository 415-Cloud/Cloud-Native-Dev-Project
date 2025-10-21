// src/main/java/com/fitnesstracker/authservice/controller/AuthController.java

package com.fitnesstracker.authservice.controller;

import com.fitnesstracker.authservice.dto.LoginRequest;
import com.fitnesstracker.authservice.dto.RegistrationRequest;
import com.fitnesstracker.authservice.dto.TokenResponse;
import com.fitnesstracker.authservice.model.Credential;
import com.fitnesstracker.authservice.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegistrationRequest request) {
        try {
            Credential newCredential = authService.register(request);

            // Return success with the user ID, but NOT the password hash
            return new ResponseEntity<>(
                    "User " + newCredential.getUsername() + " registered successfully.",
                    HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            // Handles 'Username or email already in use'
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT); // 409
        } catch (RuntimeException e) {
            // Catches errors from UserServiceExternal
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500
        }
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> loginUser(@RequestBody LoginRequest request) {
        try {
            TokenResponse tokenResponse = authService.login(request);
            return ResponseEntity.ok(tokenResponse); // 200 OK
        } catch (IllegalArgumentException e) {
            // Handles 'Invalid username or password'
            // Use 401 Unauthorized for login failures
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }
}