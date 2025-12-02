package com.clouddev.leaderboardservice.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "leaderboard_entries")
public class LeaderboardEntryEntity {

    @Id
    @Column(name = "user_id", nullable = false, unique = true)
    private String userId;

    @Column(name = "score", nullable = false)
    private double score;

    @Column(name = "streak_count", nullable = false)
    private long streakCount;

    @Column(name = "last_activity_date")
    private LocalDate lastActivityDate;

    public LeaderboardEntryEntity() {
    }

    public LeaderboardEntryEntity(String userId, double score, long streakCount, LocalDate lastActivityDate) {
        this.userId = userId;
        this.score = score;
        this.streakCount = streakCount;
        this.lastActivityDate = lastActivityDate;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

    public long getStreakCount() {
        return streakCount;
    }

    public void setStreakCount(long streakCount) {
        this.streakCount = streakCount;
    }

    public LocalDate getLastActivityDate() {
        return lastActivityDate;
    }

    public void setLastActivityDate(LocalDate lastActivityDate) {
        this.lastActivityDate = lastActivityDate;
    }
}

