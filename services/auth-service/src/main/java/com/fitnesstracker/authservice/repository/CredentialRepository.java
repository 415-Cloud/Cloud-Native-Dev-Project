package com.fitnesstracker.authservice.repository;

import com.fitnesstracker.authservice.model.Credential;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CredentialRepository extends JpaRepository<Credential, String> {

    // Used for login and registration checks
    Optional<Credential> findByEmail(String email);
}