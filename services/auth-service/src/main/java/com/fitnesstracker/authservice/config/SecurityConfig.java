package com.fitnesstracker.authservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // Provides the standard secure password hashing for the entire application
    @Bean
    public PasswordEncoder passwordEncoder() {
        // BCrypt is the standard recommended algorithm for password storage
        return new BCryptPasswordEncoder();
    }

    // Configures which requests are public and which require a token
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Microservices typically disable CSRF protection
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth
                        // Allow public access to registration and login endpoints
                        .requestMatchers("/api/auth/register", "/api/auth/login", "/health").permitAll()
                        // All other requests (e.g., internal checks) must be authenticated
                        .anyRequest().authenticated());

        return http.build();
    }
}