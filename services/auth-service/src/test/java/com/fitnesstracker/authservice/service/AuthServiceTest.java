package com.fitnesstracker.authservice.service;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import com.fitnesstracker.authservice.config.JwtUtil;
import com.fitnesstracker.authservice.dto.LoginRequest;
import com.fitnesstracker.authservice.dto.RegistrationRequest;
import com.fitnesstracker.authservice.dto.TokenResponse;
import com.fitnesstracker.authservice.model.Credential;
import com.fitnesstracker.authservice.repository.CredentialRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Tests")
class AuthServiceTest {

    @Mock
    private CredentialRepository credentialRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "userServiceUrl", "http://user-service:8081/api/users/create");
    }

    @Nested
    @DisplayName("Registration Tests")
    class RegistrationTests {

        @Test
        @DisplayName("Should successfully register a new user")
        void shouldRegisterNewUser() {
            RegistrationRequest request = new RegistrationRequest();
            request.setEmail("test@example.com");
            request.setPassword("password123");
            request.setName("Test User");

            when(credentialRepository.findByEmail(anyString())).thenReturn(Optional.empty());
            when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
            when(credentialRepository.save(any(Credential.class))).thenAnswer(invocation -> invocation.getArgument(0));

            Credential result = authService.register(request);

            assertNotNull(result);
            assertEquals("test@example.com", result.getEmail());
            assertNotNull(result.getUserId());
            verify(credentialRepository).save(any(Credential.class));
        }

        @Test
        @DisplayName("Should throw exception when email is null")
        void shouldThrowExceptionWhenEmailIsNull() {
            RegistrationRequest request = new RegistrationRequest();
            request.setEmail(null);
            request.setPassword("password123");

            IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> authService.register(request)
            );
            assertEquals("Email is required.", exception.getMessage());
        }

        @Test
        @DisplayName("Should throw exception when email is empty")
        void shouldThrowExceptionWhenEmailIsEmpty() {
            RegistrationRequest request = new RegistrationRequest();
            request.setEmail("   ");
            request.setPassword("password123");

            IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> authService.register(request)
            );
            assertEquals("Email is required.", exception.getMessage());
        }

        @Test
        @DisplayName("Should throw exception when email format is invalid")
        void shouldThrowExceptionWhenEmailFormatIsInvalid() {
            RegistrationRequest request = new RegistrationRequest();
            request.setEmail("invalid-email");
            request.setPassword("password123");

            IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> authService.register(request)
            );
            assertEquals("Invalid email format.", exception.getMessage());
        }

        @Test
        @DisplayName("Should throw exception when email already exists")
        void shouldThrowExceptionWhenEmailAlreadyExists() {
            RegistrationRequest request = new RegistrationRequest();
            request.setEmail("existing@example.com");
            request.setPassword("password123");

            when(credentialRepository.findByEmail("existing@example.com"))
                .thenReturn(Optional.of(new Credential()));

            IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> authService.register(request)
            );
            assertEquals("Email is already in use.", exception.getMessage());
        }

        @Test
        @DisplayName("Should throw exception when password is null")
        void shouldThrowExceptionWhenPasswordIsNull() {
            RegistrationRequest request = new RegistrationRequest();
            request.setEmail("test@example.com");
            request.setPassword(null);

            when(credentialRepository.findByEmail(anyString())).thenReturn(Optional.empty());

            IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> authService.register(request)
            );
            assertEquals("Password is required.", exception.getMessage());
        }

        @Test
        @DisplayName("Should throw exception when password is too short")
        void shouldThrowExceptionWhenPasswordIsTooShort() {
            RegistrationRequest request = new RegistrationRequest();
            request.setEmail("test@example.com");
            request.setPassword("12345");

            when(credentialRepository.findByEmail(anyString())).thenReturn(Optional.empty());

            IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> authService.register(request)
            );
            assertEquals("Password must be at least 6 characters long.", exception.getMessage());
        }

        @Test
        @DisplayName("Should normalize email to lowercase")
        void shouldNormalizeEmailToLowercase() {
            RegistrationRequest request = new RegistrationRequest();
            request.setEmail("TEST@EXAMPLE.COM");
            request.setPassword("password123");

            when(credentialRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());
            when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
            when(credentialRepository.save(any(Credential.class))).thenAnswer(invocation -> invocation.getArgument(0));

            Credential result = authService.register(request);

            assertEquals("test@example.com", result.getEmail());
        }

        @Test
        @DisplayName("Should throw exception when password is empty")
        void shouldThrowExceptionWhenPasswordIsEmpty() {
            RegistrationRequest request = new RegistrationRequest();
            request.setEmail("test@example.com");
            request.setPassword("");

            when(credentialRepository.findByEmail(anyString())).thenReturn(Optional.empty());

            IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> authService.register(request)
            );
            assertEquals("Password is required.", exception.getMessage());
        }
    }

    @Nested
    @DisplayName("Login Tests")
    class LoginTests {

        @Test
        @DisplayName("Should successfully login with valid credentials")
        void shouldLoginWithValidCredentials() {
            LoginRequest request = new LoginRequest();
            request.setEmail("test@example.com");
            request.setPassword("password123");

            Credential credential = new Credential();
            credential.setUserId("user-123");
            credential.setEmail("test@example.com");
            credential.setPasswordHash("encodedPassword");

            when(credentialRepository.findByEmail("test@example.com")).thenReturn(Optional.of(credential));
            when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(true);
            when(jwtUtil.generateToken("user-123", "test@example.com")).thenReturn("jwt-token");

            TokenResponse result = authService.login(request);

            assertNotNull(result);
            assertEquals("jwt-token", result.getAccessToken());
            assertEquals("user-123", result.getUserId());
        }

        @Test
        @DisplayName("Should throw exception when email is null")
        void shouldThrowExceptionWhenEmailIsNull() {
            LoginRequest request = new LoginRequest();
            request.setEmail(null);
            request.setPassword("password123");

            IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> authService.login(request)
            );
            assertEquals("Email is required.", exception.getMessage());
        }

        @Test
        @DisplayName("Should throw exception when email is empty")
        void shouldThrowExceptionWhenEmailIsEmpty() {
            LoginRequest request = new LoginRequest();
            request.setEmail("   ");
            request.setPassword("password123");

            IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> authService.login(request)
            );
            assertEquals("Email is required.", exception.getMessage());
        }

        @Test
        @DisplayName("Should throw exception when user not found")
        void shouldThrowExceptionWhenUserNotFound() {
            LoginRequest request = new LoginRequest();
            request.setEmail("nonexistent@example.com");
            request.setPassword("password123");

            when(credentialRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

            IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> authService.login(request)
            );
            assertEquals("Invalid email or password.", exception.getMessage());
        }

        @Test
        @DisplayName("Should throw exception when password is incorrect")
        void shouldThrowExceptionWhenPasswordIsIncorrect() {
            LoginRequest request = new LoginRequest();
            request.setEmail("test@example.com");
            request.setPassword("wrongpassword");

            Credential credential = new Credential();
            credential.setUserId("user-123");
            credential.setEmail("test@example.com");
            credential.setPasswordHash("encodedPassword");

            when(credentialRepository.findByEmail("test@example.com")).thenReturn(Optional.of(credential));
            when(passwordEncoder.matches("wrongpassword", "encodedPassword")).thenReturn(false);

            IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> authService.login(request)
            );
            assertEquals("Invalid email or password.", exception.getMessage());
        }

        @Test
        @DisplayName("Should throw exception when password is null")
        void shouldThrowExceptionWhenPasswordIsNull() {
            LoginRequest request = new LoginRequest();
            request.setEmail("test@example.com");
            request.setPassword(null);

            Credential credential = new Credential();
            credential.setUserId("user-123");
            credential.setEmail("test@example.com");
            credential.setPasswordHash("encodedPassword");

            when(credentialRepository.findByEmail("test@example.com")).thenReturn(Optional.of(credential));

            IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> authService.login(request)
            );
            assertEquals("Invalid email or password.", exception.getMessage());
        }

        @Test
        @DisplayName("Should normalize email during login")
        void shouldNormalizeEmailDuringLogin() {
            LoginRequest request = new LoginRequest();
            request.setEmail("  TEST@EXAMPLE.COM  ");
            request.setPassword("password123");

            Credential credential = new Credential();
            credential.setUserId("user-123");
            credential.setEmail("test@example.com");
            credential.setPasswordHash("encodedPassword");

            when(credentialRepository.findByEmail("test@example.com")).thenReturn(Optional.of(credential));
            when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(true);
            when(jwtUtil.generateToken("user-123", "test@example.com")).thenReturn("jwt-token");

            TokenResponse result = authService.login(request);

            assertNotNull(result);
            verify(credentialRepository).findByEmail("test@example.com");
        }
    }
}
