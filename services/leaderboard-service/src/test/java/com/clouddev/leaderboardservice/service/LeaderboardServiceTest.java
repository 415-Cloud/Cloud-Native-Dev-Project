package com.clouddev.leaderboardservice.service;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.clouddev.leaderboardservice.entity.LeaderboardEntryEntity;
import com.clouddev.leaderboardservice.model.LeaderboardEntry;
import com.clouddev.leaderboardservice.repository.LeaderboardRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("LeaderboardService Tests")
class LeaderboardServiceTest {

    @Mock
    private LeaderboardRepository leaderboardRepository;

    @InjectMocks
    private LeaderboardService leaderboardService;

    private LocalDate today;

    @BeforeEach
    void setUp() {
        today = LocalDate.now(ZoneOffset.UTC);
    }

    @Nested
    @DisplayName("Update Score Tests")
    class UpdateScoreTests {

        @Test
        @DisplayName("Should create new entry for new user")
        void shouldCreateNewEntryForNewUser() {
            // Arrange
            String userId = "new-user";
            double delta = 100.0;
            
            when(leaderboardRepository.findByUserId(userId)).thenReturn(Optional.empty());
            when(leaderboardRepository.save(any(LeaderboardEntryEntity.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

            // Act
            leaderboardService.updateScore(userId, delta);

            // Assert
            ArgumentCaptor<LeaderboardEntryEntity> captor = ArgumentCaptor.forClass(LeaderboardEntryEntity.class);
            verify(leaderboardRepository).save(captor.capture());
            
            LeaderboardEntryEntity savedEntry = captor.getValue();
            assertEquals(userId, savedEntry.getUserId());
            assertEquals(delta, savedEntry.getScore());
            assertEquals(1L, savedEntry.getStreakCount());
            assertEquals(today, savedEntry.getLastActivityDate());
        }

        @Test
        @DisplayName("Should update existing user's score")
        void shouldUpdateExistingUserScore() {
            // Arrange
            String userId = "existing-user";
            double initialScore = 100.0;
            double delta = 50.0;
            
            LeaderboardEntryEntity existingEntry = new LeaderboardEntryEntity(userId, initialScore, 1L, today);
            when(leaderboardRepository.findByUserId(userId)).thenReturn(Optional.of(existingEntry));
            when(leaderboardRepository.save(any(LeaderboardEntryEntity.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

            // Act
            leaderboardService.updateScore(userId, delta);

            // Assert
            ArgumentCaptor<LeaderboardEntryEntity> captor = ArgumentCaptor.forClass(LeaderboardEntryEntity.class);
            verify(leaderboardRepository).save(captor.capture());
            
            LeaderboardEntryEntity savedEntry = captor.getValue();
            assertEquals(initialScore + delta, savedEntry.getScore());
        }

        @Test
        @DisplayName("Should handle negative score delta")
        void shouldHandleNegativeScoreDelta() {
            // Arrange
            String userId = "user";
            double initialScore = 100.0;
            double delta = -30.0;
            
            LeaderboardEntryEntity existingEntry = new LeaderboardEntryEntity(userId, initialScore, 1L, today);
            when(leaderboardRepository.findByUserId(userId)).thenReturn(Optional.of(existingEntry));
            when(leaderboardRepository.save(any(LeaderboardEntryEntity.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

            // Act
            leaderboardService.updateScore(userId, delta);

            // Assert
            ArgumentCaptor<LeaderboardEntryEntity> captor = ArgumentCaptor.forClass(LeaderboardEntryEntity.class);
            verify(leaderboardRepository).save(captor.capture());
            
            assertEquals(70.0, captor.getValue().getScore());
        }

        @Test
        @DisplayName("Should increment streak for consecutive day")
        void shouldIncrementStreakForConsecutiveDay() {
            // Arrange
            String userId = "user";
            LocalDate yesterday = today.minusDays(1);
            
            LeaderboardEntryEntity existingEntry = new LeaderboardEntryEntity(userId, 100.0, 5L, yesterday);
            when(leaderboardRepository.findByUserId(userId)).thenReturn(Optional.of(existingEntry));
            when(leaderboardRepository.save(any(LeaderboardEntryEntity.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

            // Act
            leaderboardService.updateScore(userId, 10.0);

            // Assert
            ArgumentCaptor<LeaderboardEntryEntity> captor = ArgumentCaptor.forClass(LeaderboardEntryEntity.class);
            verify(leaderboardRepository).save(captor.capture());
            
            assertEquals(6L, captor.getValue().getStreakCount());
        }

        @Test
        @DisplayName("Should reset streak for non-consecutive day")
        void shouldResetStreakForNonConsecutiveDay() {
            // Arrange
            String userId = "user";
            LocalDate threeDaysAgo = today.minusDays(3);
            
            LeaderboardEntryEntity existingEntry = new LeaderboardEntryEntity(userId, 100.0, 10L, threeDaysAgo);
            when(leaderboardRepository.findByUserId(userId)).thenReturn(Optional.of(existingEntry));
            when(leaderboardRepository.save(any(LeaderboardEntryEntity.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

            // Act
            leaderboardService.updateScore(userId, 10.0);

            // Assert
            ArgumentCaptor<LeaderboardEntryEntity> captor = ArgumentCaptor.forClass(LeaderboardEntryEntity.class);
            verify(leaderboardRepository).save(captor.capture());
            
            assertEquals(1L, captor.getValue().getStreakCount());
        }

        @Test
        @DisplayName("Should maintain streak for same day activity")
        void shouldMaintainStreakForSameDayActivity() {
            // Arrange
            String userId = "user";
            
            LeaderboardEntryEntity existingEntry = new LeaderboardEntryEntity(userId, 100.0, 5L, today);
            when(leaderboardRepository.findByUserId(userId)).thenReturn(Optional.of(existingEntry));
            when(leaderboardRepository.save(any(LeaderboardEntryEntity.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

            // Act
            leaderboardService.updateScore(userId, 10.0);

            // Assert
            ArgumentCaptor<LeaderboardEntryEntity> captor = ArgumentCaptor.forClass(LeaderboardEntryEntity.class);
            verify(leaderboardRepository).save(captor.capture());
            
            assertEquals(5L, captor.getValue().getStreakCount());
        }
    }

    @Nested
    @DisplayName("Get Top N Tests")
    class GetTopNTests {

        @Test
        @DisplayName("Should return top N users")
        void shouldReturnTopNUsers() {
            // Arrange
            List<LeaderboardEntryEntity> entities = Arrays.asList(
                new LeaderboardEntryEntity("user1", 1000.0, 10L, today),
                new LeaderboardEntryEntity("user2", 800.0, 5L, today),
                new LeaderboardEntryEntity("user3", 600.0, 3L, today)
            );
            
            when(leaderboardRepository.findTopN(3)).thenReturn(entities);

            // Act
            List<LeaderboardEntry> result = leaderboardService.getTopN(3);

            // Assert
            assertEquals(3, result.size());
            assertEquals("user1", result.get(0).getUserId());
            assertEquals(1L, result.get(0).getRank());
            assertEquals(1000.0, result.get(0).getScore());
            
            assertEquals("user2", result.get(1).getUserId());
            assertEquals(2L, result.get(1).getRank());
            
            assertEquals("user3", result.get(2).getUserId());
            assertEquals(3L, result.get(2).getRank());
        }

        @Test
        @DisplayName("Should return empty list for n <= 0")
        void shouldReturnEmptyListForInvalidN() {
            // Act
            List<LeaderboardEntry> resultZero = leaderboardService.getTopN(0);
            List<LeaderboardEntry> resultNegative = leaderboardService.getTopN(-5);

            // Assert
            assertTrue(resultZero.isEmpty());
            assertTrue(resultNegative.isEmpty());
            verify(leaderboardRepository, never()).findTopN(anyInt());
        }

        @Test
        @DisplayName("Should return empty list when no entries exist")
        void shouldReturnEmptyListWhenNoEntries() {
            // Arrange
            when(leaderboardRepository.findTopN(10)).thenReturn(Collections.emptyList());

            // Act
            List<LeaderboardEntry> result = leaderboardService.getTopN(10);

            // Assert
            assertTrue(result.isEmpty());
        }

        @Test
        @DisplayName("Should handle null repository response")
        void shouldHandleNullRepositoryResponse() {
            // Arrange
            when(leaderboardRepository.findTopN(10)).thenReturn(null);

            // Act
            List<LeaderboardEntry> result = leaderboardService.getTopN(10);

            // Assert
            assertTrue(result.isEmpty());
        }
    }

    @Nested
    @DisplayName("Get Rank Tests")
    class GetRankTests {

        @Test
        @DisplayName("Should return user's rank")
        void shouldReturnUserRank() {
            // Arrange
            String userId = "user1";
            LeaderboardEntryEntity entity = new LeaderboardEntryEntity(userId, 500.0, 5L, today);
            
            when(leaderboardRepository.findByUserId(userId)).thenReturn(Optional.of(entity));
            when(leaderboardRepository.getUserRank(userId)).thenReturn(3L);

            // Act
            Optional<LeaderboardEntry> result = leaderboardService.getRank(userId);

            // Assert
            assertTrue(result.isPresent());
            assertEquals(userId, result.get().getUserId());
            assertEquals(500.0, result.get().getScore());
            assertEquals(3L, result.get().getRank());
            assertEquals(5L, result.get().getStreak());
        }

        @Test
        @DisplayName("Should return empty for non-existent user")
        void shouldReturnEmptyForNonExistentUser() {
            // Arrange
            when(leaderboardRepository.findByUserId("nonexistent")).thenReturn(Optional.empty());

            // Act
            Optional<LeaderboardEntry> result = leaderboardService.getRank("nonexistent");

            // Assert
            assertTrue(result.isEmpty());
        }

        @Test
        @DisplayName("Should handle null rank from repository")
        void shouldHandleNullRank() {
            // Arrange
            String userId = "user1";
            LeaderboardEntryEntity entity = new LeaderboardEntryEntity(userId, 500.0, 5L, today);
            
            when(leaderboardRepository.findByUserId(userId)).thenReturn(Optional.of(entity));
            when(leaderboardRepository.getUserRank(userId)).thenReturn(null);

            // Act
            Optional<LeaderboardEntry> result = leaderboardService.getRank(userId);

            // Assert
            assertTrue(result.isPresent());
            assertEquals(0L, result.get().getRank());
        }
    }

    @Nested
    @DisplayName("Get Streak Tests")
    class GetStreakTests {

        @Test
        @DisplayName("Should return user's streak count")
        void shouldReturnUserStreakCount() {
            // Arrange
            String userId = "user1";
            LeaderboardEntryEntity entity = new LeaderboardEntryEntity(userId, 500.0, 7L, today);
            
            when(leaderboardRepository.findByUserId(userId)).thenReturn(Optional.of(entity));

            // Act
            long streak = leaderboardService.getStreak(userId);

            // Assert
            assertEquals(7L, streak);
        }

        @Test
        @DisplayName("Should return 0 for non-existent user")
        void shouldReturnZeroForNonExistentUser() {
            // Arrange
            when(leaderboardRepository.findByUserId("nonexistent")).thenReturn(Optional.empty());

            // Act
            long streak = leaderboardService.getStreak("nonexistent");

            // Assert
            assertEquals(0L, streak);
        }
    }
}
