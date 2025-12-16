package com.clouddev.leaderboardservice.service;

import com.clouddev.leaderboardservice.entity.LeaderboardEntryEntity;
import com.clouddev.leaderboardservice.model.LeaderboardEntry;
import com.clouddev.leaderboardservice.repository.LeaderboardRepository;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LeaderboardService {

    private final LeaderboardRepository leaderboardRepository;
    private final org.springframework.web.client.RestTemplate restTemplate;

    @org.springframework.beans.factory.annotation.Value("${USER_SERVICE_URL:http://user-service:8081}")
    private String userServiceUrl;

    public LeaderboardService(LeaderboardRepository leaderboardRepository,
            org.springframework.web.client.RestTemplate restTemplate) {
        this.leaderboardRepository = leaderboardRepository;
        this.restTemplate = restTemplate;
    }

    @Transactional
    public void updateScore(String userId, double delta) {
        LocalDate today = LocalDate.now(ZoneOffset.UTC);

        Optional<LeaderboardEntryEntity> existingEntry = leaderboardRepository.findByUserId(userId);

        if (existingEntry.isPresent()) {
            LeaderboardEntryEntity entry = existingEntry.get();
            entry.setScore(entry.getScore() + delta);
            updateStreak(entry, today);
            leaderboardRepository.save(entry);
        } else {
            LeaderboardEntryEntity newEntry = new LeaderboardEntryEntity(userId, delta, 1L, today);
            leaderboardRepository.save(newEntry);
        }
    }

    public List<LeaderboardEntry> getTopN(int n) {
        if (n <= 0) {
            return Collections.emptyList();
        }

        List<LeaderboardEntryEntity> entities = leaderboardRepository.findTopN(n);
        if (entities == null || entities.isEmpty()) {
            return Collections.emptyList();
        }

        // Collect User IDs
        List<String> userIds = new ArrayList<>();
        for (LeaderboardEntryEntity entity : entities) {
            userIds.add(entity.getUserId());
        }

        // Fetch Usernames
        java.util.Map<String, String> userNames = fetchUserNames(userIds);

        List<LeaderboardEntry> entries = new ArrayList<>(entities.size());
        for (int i = 0; i < entities.size(); i++) {
            LeaderboardEntryEntity entity = entities.get(i);
            long rank = i + 1L;
            String userId = entity.getUserId();
            String username = userNames.getOrDefault(userId, userId); // Fallback to ID if name not found

            entries.add(new LeaderboardEntry(
                    userId,
                    username,
                    entity.getScore(),
                    rank,
                    entity.getStreakCount()));
        }
        return entries;
    }

    public Optional<LeaderboardEntry> getRank(String userId) {
        Optional<LeaderboardEntryEntity> entityOpt = leaderboardRepository.findByUserId(userId);
        if (entityOpt.isEmpty()) {
            return Optional.empty();
        }

        LeaderboardEntryEntity entity = entityOpt.get();
        Long rank = leaderboardRepository.getUserRank(userId);

        // Fetch single username
        java.util.Map<String, String> userNames = fetchUserNames(Collections.singletonList(userId));
        String username = userNames.getOrDefault(userId, userId);

        return Optional.of(new LeaderboardEntry(
                entity.getUserId(),
                username,
                entity.getScore(),
                rank != null ? rank : 0L,
                entity.getStreakCount()));
    }

    public long getStreak(String userId) {
        return leaderboardRepository.findByUserId(userId)
                .map(LeaderboardEntryEntity::getStreakCount)
                .orElse(0L);
    }

    private void updateStreak(LeaderboardEntryEntity entry, LocalDate today) {
        LocalDate lastDate = entry.getLastActivityDate();
        long currentCount = entry.getStreakCount();

        if (lastDate == null) {
            entry.setStreakCount(1L);
        } else if (lastDate.isEqual(today)) {
            // Same day, no change to streak
            if (currentCount == 0) {
                entry.setStreakCount(1L);
            }
        } else if (lastDate.plusDays(1).isEqual(today)) {
            // Consecutive day, increment streak
            entry.setStreakCount(currentCount + 1L);
        } else {
            // Streak broken, reset to 1
            entry.setStreakCount(1L);
        }

        entry.setLastActivityDate(today);
    }

    private java.util.Map<String, String> fetchUserNames(List<String> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return Collections.emptyMap();
        }
        try {
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
            org.springframework.http.HttpEntity<List<String>> request = new org.springframework.http.HttpEntity<>(
                    userIds, headers);

            // Call User Service batch endpoint
            org.springframework.http.ResponseEntity<java.util.Map> response = restTemplate
                    .postForEntity(userServiceUrl + "/api/users/names", request, java.util.Map.class);

            if (response.getBody() != null) {
                return (java.util.Map<String, String>) response.getBody();
            }
        } catch (Exception e) {
            System.err.println("Failed to fetch usernames: " + e.getMessage());
            // Fallback - return empty map
        }
        return Collections.emptyMap();
    }
}
