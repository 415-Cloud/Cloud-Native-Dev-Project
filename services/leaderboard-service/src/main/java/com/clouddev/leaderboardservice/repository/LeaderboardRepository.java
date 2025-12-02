package com.clouddev.leaderboardservice.repository;

import com.clouddev.leaderboardservice.entity.LeaderboardEntryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeaderboardRepository extends JpaRepository<LeaderboardEntryEntity, String> {

    /**
     * Get top N users ordered by score descending
     */
    @Query("SELECT e FROM LeaderboardEntryEntity e ORDER BY e.score DESC")
    List<LeaderboardEntryEntity> findTopByOrderByScoreDesc(@Param("limit") int limit);

    /**
     * Get top N entries ordered by score descending
     */
    @Query(value = "SELECT * FROM leaderboard_entries ORDER BY score DESC LIMIT :limit", nativeQuery = true)
    List<LeaderboardEntryEntity> findTopN(@Param("limit") int limit);

    /**
     * Get user's rank (1-based, where rank 1 is highest score)
     */
    @Query(value = "SELECT COUNT(*) + 1 FROM leaderboard_entries WHERE score > (SELECT COALESCE(score, 0) FROM leaderboard_entries WHERE user_id = :userId)", nativeQuery = true)
    Long getUserRank(@Param("userId") String userId);

    /**
     * Find entry by userId
     */
    Optional<LeaderboardEntryEntity> findByUserId(String userId);
}

