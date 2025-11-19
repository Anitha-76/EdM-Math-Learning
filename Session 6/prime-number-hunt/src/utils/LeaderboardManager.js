import { CONFIG } from './GameConfig.js';

export default class LeaderboardManager {
    constructor() {
        this.leaderboards = this.loadLeaderboards();
    }

    loadLeaderboards() {
        try {
            const saved = localStorage.getItem('primeHunt_leaderboards');
            return saved ? JSON.parse(saved) : this.getDefaultLeaderboards();
        } catch (e) {
            return this.getDefaultLeaderboards();
        }
    }

    getDefaultLeaderboards() {
        return {
            classic: [],
            time_attack: [],
            endless: [],
            challenge_twin_primes: [],
            challenge_mersenne_primes: [],
            challenge_small_primes: [],
            challenge_large_primes: [],
            challenge_fibonacci_primes: []
        };
    }

    addScore(mode, playerName, score, stats = {}) {
        const entry = {
            name: playerName,
            score: score,
            date: new Date().toISOString(),
            stats: stats
        };

        if (!this.leaderboards[mode]) {
            this.leaderboards[mode] = [];
        }

        this.leaderboards[mode].push(entry);

        // Sort by score descending
        this.leaderboards[mode].sort((a, b) => b.score - a.score);

        // Keep only top entries
        this.leaderboards[mode] = this.leaderboards[mode].slice(0, CONFIG.MAX_LEADERBOARD_ENTRIES);

        this.saveLeaderboards();

        // Return rank (1-indexed)
        return this.leaderboards[mode].findIndex(e =>
            e.name === playerName && e.score === score && e.date === entry.date
        ) + 1;
    }

    getLeaderboard(mode) {
        return this.leaderboards[mode] || [];
    }

    isHighScore(mode, score) {
        const board = this.getLeaderboard(mode);
        if (board.length < CONFIG.MAX_LEADERBOARD_ENTRIES) {
            return true;
        }
        return score > board[board.length - 1].score;
    }

    saveLeaderboards() {
        try {
            localStorage.setItem('primeHunt_leaderboards', JSON.stringify(this.leaderboards));
        } catch (e) {
            console.warn('Could not save leaderboards:', e);
        }
    }

    clearLeaderboard(mode) {
        if (mode === 'all') {
            this.leaderboards = this.getDefaultLeaderboards();
        } else {
            this.leaderboards[mode] = [];
        }
        this.saveLeaderboards();
    }
}
