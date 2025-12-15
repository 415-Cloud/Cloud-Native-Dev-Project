package com.fitnesstracker.authservice;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import org.junit.jupiter.api.Test;

/**
 * Basic application test.
 * Note: Full @SpringBootTest disabled due to JaCoCo incompatibility with Java 25.
 */
class AuthServiceApplicationTests {

    @Test
    void applicationClassExists() {
        assertDoesNotThrow(() -> {
            Class.forName("com.fitnesstracker.authservice.AuthServiceApplication");
        });
    }
}
