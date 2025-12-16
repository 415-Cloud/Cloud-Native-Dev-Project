package com.clouddev.leaderboardservice.model;

public class LeaderboardEntry {

    private final String userId;
    private final double score;
    private final long rank;
    private final long streak;

    private final String username;

    // Legacy constructor for backward compatibility or direct usage
    public LeaderboardEntry(String userId, double score, long rank, long streak) {
        this(userId, null, score, rank, streak);
    }

    public LeaderboardEntry(String userId, String username, double score, long rank, long streak) {
        this.userId = userId;
        this.username = username;
        this.score = score;
        this.rank = rank;
        this.streak = streak;
    }

    public String getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public double getScore() {
        return score;
    }

    public long getRank() {
        return rank;
    }

    public long getStreak() {
        return streak;
    }
}
