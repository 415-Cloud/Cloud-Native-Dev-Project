// src/main/java/com/fitnesstracker/userservice/repository/UserProfileRepository.java

package main.java.com.fitnesstracker.userservice.repository;

import com.fitnesstracker.userservice.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

// Provides basic CRUD operations on the UserProfile entity
public interface UserProfileRepository extends JpaRepository<UserProfile, String> {
    // Custom finder methods can be added here if needed (e.g., findByUsername)
}