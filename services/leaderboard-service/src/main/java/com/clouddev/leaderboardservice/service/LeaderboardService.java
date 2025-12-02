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

    public LeaderboardService(LeaderboardRepository leaderboardRepository) {
        this.leaderboardRepository = leaderboardRepository;
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

        List<LeaderboardEntry> entries = new ArrayList<>(entities.size());
        for (int i = 0; i < entities.size(); i++) {
            LeaderboardEntryEntity entity = entities.get(i);
            long rank = i + 1L;
            entries.add(new LeaderboardEntry(
                entity.getUserId(),
                entity.getScore(),
                rank,
                entity.getStreakCount()
            ));
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
        
        return Optional.of(new LeaderboardEntry(
            entity.getUserId(),
            entity.getScore(),
            rank != null ? rank : 0L,
            entity.getStreakCount()
        ));
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
}
