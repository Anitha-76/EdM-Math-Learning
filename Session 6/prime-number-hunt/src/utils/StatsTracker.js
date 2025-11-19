import { isPrime, getFactors } from './MathHelpers.js';

export default class StatsTracker {
    constructor() {
        this.reset();
        this.loadLifetimeStats();
    }

    reset() {
        // Session stats
        this.shotsFired = 0;
        this.correctHits = 0;
        this.wrongHits = 0;
        this.missedPrimes = 0;
        this.currentStreak = 0;
        this.maxStreak = 0;
        this.currentCombo = 0;
        this.maxCombo = 0;
        this.hintsUsed = 0;
        this.powerUpsCollected = 0;
        this.gameStartTime = 0;
        this.gameEndTime = 0;
        this.perfectWaves = 0;
        this.currentWavePerfect = true;

        // Prime tracking
        this.primesDestroyed = [];
        this.compositesHit = [];

        // Number range performance
        this.rangePerformance = {
            '2-30': { correct: 0, wrong: 0 },
            '31-60': { correct: 0, wrong: 0 },
            '61-100': { correct: 0, wrong: 0 },
            '100+': { correct: 0, wrong: 0 }
        };

        // Response time tracking
        this.responseTimes = [];
        this.lastEnemySpawnTime = 0;
    }

    loadLifetimeStats() {
        const saved = localStorage.getItem('primeHuntLifetimeStats');
        if (saved) {
            this.lifetimeStats = JSON.parse(saved);
        } else {
            this.lifetimeStats = {
                totalGames: 0,
                totalScore: 0,
                highScore: 0,
                totalPrimesDestroyed: 0,
                totalShotsFired: 0,
                bestAccuracy: 0,
                highestWave: 0,
                longestStreak: 0,
                totalPlayTime: 0
            };
        }
    }

    saveLifetimeStats() {
        localStorage.setItem('primeHuntLifetimeStats', JSON.stringify(this.lifetimeStats));
    }

    startGame() {
        this.reset();
        this.gameStartTime = Date.now();
    }

    endGame(finalScore, waveReached) {
        this.gameEndTime = Date.now();
        const playTime = this.gameEndTime - this.gameStartTime;

        // Update lifetime stats
        this.lifetimeStats.totalGames++;
        this.lifetimeStats.totalScore += finalScore;
        this.lifetimeStats.highScore = Math.max(this.lifetimeStats.highScore, finalScore);
        this.lifetimeStats.totalPrimesDestroyed += this.correctHits;
        this.lifetimeStats.totalShotsFired += this.shotsFired;
        this.lifetimeStats.highestWave = Math.max(this.lifetimeStats.highestWave, waveReached);
        this.lifetimeStats.longestStreak = Math.max(this.lifetimeStats.longestStreak, this.maxStreak);
        this.lifetimeStats.totalPlayTime += playTime;

        const accuracy = this.getAccuracy();
        this.lifetimeStats.bestAccuracy = Math.max(this.lifetimeStats.bestAccuracy, accuracy);

        this.saveLifetimeStats();
    }

    recordShot() {
        this.shotsFired++;
    }

    recordHit(number, isPrimeNumber, responseTime = 0) {
        const range = this.getNumberRange(number);

        if (isPrimeNumber) {
            this.correctHits++;
            this.currentStreak++;
            this.maxStreak = Math.max(this.maxStreak, this.currentStreak);
            this.primesDestroyed.push(number);
            this.rangePerformance[range].correct++;

            if (responseTime > 0) {
                this.responseTimes.push(responseTime);
            }
        } else {
            this.wrongHits++;
            this.currentStreak = 0;
            this.currentWavePerfect = false;
            this.compositesHit.push(number);
            this.rangePerformance[range].wrong++;
        }
    }

    recordMissedPrime(number) {
        this.missedPrimes++;
        this.currentStreak = 0;
        this.currentWavePerfect = false;
    }

    recordCombo(comboCount) {
        this.currentCombo = comboCount;
        this.maxCombo = Math.max(this.maxCombo, comboCount);
    }

    recordHintUsed() {
        this.hintsUsed++;
    }

    recordPowerUpCollected() {
        this.powerUpsCollected++;
    }

    recordWaveComplete() {
        if (this.currentWavePerfect) {
            this.perfectWaves++;
        }
        this.currentWavePerfect = true; // Reset for next wave
    }

    recordEnemySpawn() {
        this.lastEnemySpawnTime = Date.now();
    }

    getNumberRange(number) {
        if (number <= 30) return '2-30';
        if (number <= 60) return '31-60';
        if (number <= 100) return '61-100';
        return '100+';
    }

    getAccuracy() {
        if (this.shotsFired === 0) return 0;
        return Math.round((this.correctHits / this.shotsFired) * 100);
    }

    getAverageResponseTime() {
        if (this.responseTimes.length === 0) return 0;
        const sum = this.responseTimes.reduce((a, b) => a + b, 0);
        return Math.round(sum / this.responseTimes.length);
    }

    getGameDuration() {
        if (this.gameEndTime === 0) {
            return Date.now() - this.gameStartTime;
        }
        return this.gameEndTime - this.gameStartTime;
    }

    getFormattedDuration() {
        const ms = this.getGameDuration();
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    getMostMissedNumbers() {
        // Find composite numbers that were hit multiple times
        const counts = {};
        this.compositesHit.forEach(num => {
            counts[num] = (counts[num] || 0) + 1;
        });

        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([num, count]) => ({
                number: parseInt(num),
                count,
                factors: getFactors(parseInt(num))
            }));
    }

    getRangeAccuracy(range) {
        const data = this.rangePerformance[range];
        const total = data.correct + data.wrong;
        if (total === 0) return 0;
        return Math.round((data.correct / total) * 100);
    }

    getSessionStats() {
        return {
            shotsFired: this.shotsFired,
            correctHits: this.correctHits,
            wrongHits: this.wrongHits,
            missedPrimes: this.missedPrimes,
            accuracy: this.getAccuracy(),
            maxStreak: this.maxStreak,
            maxCombo: this.maxCombo,
            hintsUsed: this.hintsUsed,
            powerUpsCollected: this.powerUpsCollected,
            perfectWaves: this.perfectWaves,
            gameDuration: this.getFormattedDuration(),
            averageResponseTime: this.getAverageResponseTime(),
            primesDestroyed: this.primesDestroyed,
            mostMissedNumbers: this.getMostMissedNumbers(),
            rangePerformance: {
                '2-30': this.getRangeAccuracy('2-30'),
                '31-60': this.getRangeAccuracy('31-60'),
                '61-100': this.getRangeAccuracy('61-100'),
                '100+': this.getRangeAccuracy('100+')
            }
        };
    }

    getLifetimeStats() {
        return this.lifetimeStats;
    }

    // Check specific achievement conditions
    checkSpeedDemon() {
        return this.correctHits >= 20 && this.getGameDuration() < 60000;
    }

    checkSurvivorWin(livesRemaining) {
        return livesRemaining === 1;
    }
}
