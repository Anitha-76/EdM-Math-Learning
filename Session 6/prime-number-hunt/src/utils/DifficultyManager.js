import { CONFIG, DIFFICULTY_LEVELS } from './GameConfig.js';

export default class DifficultyManager {
    constructor() {
        this.currentDifficulty = this.loadDifficulty() || 'NORMAL';
    }

    setDifficulty(level) {
        if (!DIFFICULTY_LEVELS[level]) {
            console.warn(`Invalid difficulty: ${level}`);
            return;
        }
        this.currentDifficulty = level;
        this.saveDifficulty();
    }

    getDifficulty() {
        return this.currentDifficulty;
    }

    getDifficultyConfig() {
        return DIFFICULTY_LEVELS[this.currentDifficulty];
    }

    applyDifficulty(baseConfig) {
        const diffConfig = this.getDifficultyConfig();

        return {
            enemySpeed: baseConfig.enemySpeed * diffConfig.speedMultiplier,
            spawnRate: baseConfig.spawnRate * diffConfig.spawnRateMultiplier,
            numberRangeMax: Math.min(baseConfig.numberRangeMax, diffConfig.numberRangeMax),
            lives: diffConfig.lives
        };
    }

    saveDifficulty() {
        try {
            localStorage.setItem('primeHunt_difficulty', this.currentDifficulty);
        } catch (e) {
            console.warn('Could not save difficulty:', e);
        }
    }

    loadDifficulty() {
        try {
            return localStorage.getItem('primeHunt_difficulty');
        } catch (e) {
            return null;
        }
    }
}
