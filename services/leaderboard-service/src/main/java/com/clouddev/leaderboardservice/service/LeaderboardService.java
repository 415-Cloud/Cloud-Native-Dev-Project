package com.clouddev.leaderboardservice.service;

import com.clouddev.leaderboardservice.model.LeaderboardEntry;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.data.redis.core.ZSetOperations.TypedTuple;
import org.springframework.stereotype.Service;

@Service
public class LeaderboardService {

    private static final String LEADERBOARD_KEY = "global:leaderboard";
    private static final String STREAK_KEY_PATTERN = "user:streak:%s";
    private static final String STREAK_COUNT_FIELD = "count";
    private static final String STREAK_LAST_DATE_FIELD = "lastDate";

    private final RedisTemplate<String, String> redisTemplate;
    private final ZSetOperations<String, String> zSetOperations;
    private final HashOperations<String, String, String> hashOperations;

    public LeaderboardService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
        this.zSetOperations = redisTemplate.opsForZSet();
        this.hashOperations = redisTemplate.opsForHash();
    }

    public void updateScore(String userId, double delta) {
        zSetOperations.incrementScore(LEADERBOARD_KEY, userId, delta);
        updateStreak(userId);
    }

    public List<LeaderboardEntry> getTopN(int n) {
        if (n <= 0) {
            return Collections.emptyList();
        }

        Set<TypedTuple<String>> tuples = zSetOperations.reverseRangeWithScores(LEADERBOARD_KEY, 0, n - 1);
        if (tuples == null || tuples.isEmpty()) {
            return Collections.emptyList();
        }

        List<LeaderboardEntry> entries = new ArrayList<>(tuples.size());
        int index = 0;
        for (TypedTuple<String> tuple : tuples) {
            if (tuple.getValue() == null || tuple.getScore() == null) {
                continue;
            }
            long rank = index + 1L;
            long streak = getStreak(tuple.getValue());
            entries.add(new LeaderboardEntry(tuple.getValue(), tuple.getScore(), rank, streak));
            index++;
        }
        return entries;
    }

    public Optional<LeaderboardEntry> getRank(String userId) {
        Long reverseRank = zSetOperations.reverseRank(LEADERBOARD_KEY, userId);
        Double score = zSetOperations.score(LEADERBOARD_KEY, userId);
        if (reverseRank == null || score == null) {
            return Optional.empty();
        }
        long streak = getStreak(userId);
        return Optional.of(new LeaderboardEntry(userId, score, reverseRank + 1L, streak));
    }

    public long getStreak(String userId) {
        String streakKey = streakKey(userId);
        String count = hashOperations.get(streakKey, STREAK_COUNT_FIELD);
        if (count == null) {
            return 0L;
        }
        try {
            return Long.parseLong(count);
        } catch (NumberFormatException ex) {
            return 0L;
        }
    }

    private void updateStreak(String userId) {
        String streakKey = streakKey(userId);
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        String lastRecordedDate = hashOperations.get(streakKey, STREAK_LAST_DATE_FIELD);
        String currentCountRaw = hashOperations.get(streakKey, STREAK_COUNT_FIELD);
        long currentCount = parseCount(currentCountRaw);

        long updatedCount = 1L;
        if (lastRecordedDate != null) {
            LocalDate lastDate = parseIsoDate(lastRecordedDate);
            if (lastDate != null) {
                if (lastDate.isEqual(today)) {
                    updatedCount = currentCount == 0 ? 1L : currentCount;
                } else if (lastDate.plusDays(1).isEqual(today)) {
                    updatedCount = currentCount + 1L;
                }
            }
        }

        hashOperations.put(streakKey, STREAK_COUNT_FIELD, Long.toString(updatedCount));
        hashOperations.put(streakKey, STREAK_LAST_DATE_FIELD, today.toString());
    }

    private String streakKey(String userId) {
        return STREAK_KEY_PATTERN.formatted(userId);
    }

    private long parseCount(String value) {
        if (value == null) {
            return 0L;
        }
        try {
            return Long.parseLong(value);
        } catch (NumberFormatException ex) {
            return 0L;
        }
    }

    private LocalDate parseIsoDate(String value) {
        try {
            return LocalDate.parse(value);
        } catch (Exception ex) {
            return null;
        }
    }
}
