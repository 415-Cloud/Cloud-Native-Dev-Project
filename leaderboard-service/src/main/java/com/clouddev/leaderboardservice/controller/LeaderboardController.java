package com.clouddev.leaderboardservice.controller;

import com.clouddev.leaderboardservice.model.LeaderboardEntry;
import com.clouddev.leaderboardservice.service.LeaderboardService;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @PostMapping("/update/{userId}")
    public ResponseEntity<Void> updateScore(@PathVariable String userId,
                                            @RequestBody ScoreUpdateRequest request) {
        double delta = request != null ? request.scoreDelta() : 0.0d;
        leaderboardService.updateScore(userId, delta);
        return ResponseEntity.accepted().build();
    }

    @GetMapping("/top/{n}")
    public ResponseEntity<List<LeaderboardEntry>> getTop(@PathVariable int n) {
        List<LeaderboardEntry> entries = leaderboardService.getTopN(n);
        return ResponseEntity.ok(entries);
    }

    @GetMapping("/rank/{userId}")
    public ResponseEntity<LeaderboardEntry> getRank(@PathVariable String userId) {
        Optional<LeaderboardEntry> entry = leaderboardService.getRank(userId);
        return entry.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    public record ScoreUpdateRequest(double scoreDelta) {}
}
