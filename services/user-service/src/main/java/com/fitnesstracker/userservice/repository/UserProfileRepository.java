package com.fitnesstracker.userservice.repository;

import com.fitnesstracker.userservice.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Provides basic CRUD operations on the UserProfile entity
@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, String> {
    // Optional: Add custom finder methods here if needed
    UserProfile findByEmail(String email);
}
