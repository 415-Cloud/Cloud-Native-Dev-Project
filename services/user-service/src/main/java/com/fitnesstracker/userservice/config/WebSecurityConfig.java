package com.fitnesstracker.userservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class WebSecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF for microservices

                .authorizeHttpRequests(auth -> auth
                        // 1. Allow internal profile creation call from Auth Service
                        .requestMatchers("/api/users/create").permitAll()
                        // 2. Require authentication for all profile GET/PUT/DELETE
                        .anyRequest().authenticated());

        // Note: A real implementation would require adding a custom JWT Filter
        // here (before UsernamePasswordAuthenticationFilter) to extract and
        // validate the token on every authenticated request.

        return http.build();
    }
}
