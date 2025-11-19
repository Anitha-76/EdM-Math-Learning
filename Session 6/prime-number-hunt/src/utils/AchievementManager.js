import { CONFIG, ACHIEVEMENTS } from './GameConfig.js';

export default class AchievementManager {
    constructor(scene) {
        this.scene = scene;
        this.unlockedAchievements = this.loadUnlockedAchievements();
        this.newlyUnlocked = [];
        this.notificationQueue = [];
        this.isShowingNotification = false;
    }

    loadUnlockedAchievements() {
        const saved = localStorage.getItem('primeHuntAchievements');
        if (saved) {
            return JSON.parse(saved);
        }
        return {};
    }

    saveUnlockedAchievements() {
        localStorage.setItem('primeHuntAchievements', JSON.stringify(this.unlockedAchievements));
    }

    isUnlocked(achievementId) {
        return this.unlockedAchievements[achievementId] === true;
    }

    unlock(achievementId) {
        if (this.isUnlocked(achievementId)) return false;

        const achievement = Object.values(ACHIEVEMENTS).find(a => a.id === achievementId);
        if (!achievement) return false;

        this.unlockedAchievements[achievementId] = true;
        this.newlyUnlocked.push(achievementId);
        this.saveUnlockedAchievements();

        // Queue notification
        this.notificationQueue.push(achievement);
        this.showNextNotification();

        return true;
    }

    showNextNotification() {
        if (this.isShowingNotification || this.notificationQueue.length === 0) return;

        this.isShowingNotification = true;
        const achievement = this.notificationQueue.shift();

        // Create achievement notification
        const container = this.scene.add.container(400, -100);

        // Background
        const bg = this.scene.add.rectangle(0, 0, 350, 80, 0x000000, 0.9);
        bg.setStrokeStyle(3, 0xffd700);

        // Icon
        const icon = this.scene.add.text(-140, 0, achievement.icon, {
            fontSize: '36px'
        }).setOrigin(0.5);

        // Title
        const title = this.scene.add.text(-20, -15, 'Achievement Unlocked!', {
            fontSize: '14px',
            fill: '#ffd700',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);

        // Name
        const name = this.scene.add.text(-20, 10, achievement.name, {
            fontSize: '18px',
            fill: '#ffffff',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);

        container.add([bg, icon, title, name]);

        // Animate in
        this.scene.tweens.add({
            targets: container,
            y: 60,
            duration: 500,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Hold for a moment
                this.scene.time.delayedCall(2500, () => {
                    // Animate out
                    this.scene.tweens.add({
                        targets: container,
                        y: -100,
                        alpha: 0,
                        duration: 500,
                        ease: 'Back.easeIn',
                        onComplete: () => {
                            container.destroy();
                            this.isShowingNotification = false;
                            this.showNextNotification();
                        }
                    });
                });
            }
        });
    }

    checkAchievements(stats, waveReached, livesRemaining) {
        // FIRST_BLOOD - Destroy your first prime
        if (stats.correctHits >= 1) {
            this.unlock('first_blood');
        }

        // ACCURACY_MASTER - 90% accuracy
        if (stats.accuracy >= CONFIG.ACCURACY_MASTER_THRESHOLD && stats.shotsFired >= 10) {
            this.unlock('accuracy_master');
        }

        // SPEED_DEMON - 20 primes in 60 seconds
        if (stats.checkSpeedDemon && stats.checkSpeedDemon()) {
            this.unlock('speed_demon');
        }

        // PERFECTIONIST - 3 waves without hitting composite
        if (stats.perfectWaves >= CONFIG.PERFECTIONIST_WAVES) {
            this.unlock('perfectionist');
        }

        // PRIME_EXPERT - 10-prime streak
        if (stats.maxStreak >= CONFIG.PRIME_EXPERT_STREAK) {
            this.unlock('prime_expert');
        }

        // WAVE_MASTER - Reach wave 10
        if (waveReached >= CONFIG.WAVE_MASTER_WAVES) {
            this.unlock('wave_master');
        }

        // MATHEMATICIAN - Score 1000 points
        if (this.scene.score >= CONFIG.MATHEMATICIAN_SCORE) {
            this.unlock('mathematician');
        }

        // COMBO_KING - 5x combo
        if (stats.maxCombo >= 5) {
            this.unlock('combo_king');
        }

        // SURVIVOR - Win with 1 life
        if (stats.checkSurvivorWin && stats.checkSurvivorWin(livesRemaining)) {
            this.unlock('survivor');
        }
    }

    checkEndGameAchievements(stats, waveReached, livesRemaining) {
        // NO_HINTS - Complete game without hints
        if (stats.hintsUsed === 0 && waveReached >= 3) {
            this.unlock('no_hints');
        }

        // Final check for all achievements
        this.checkAchievements(stats, waveReached, livesRemaining);
    }

    getUnlockedCount() {
        return Object.keys(this.unlockedAchievements).length;
    }

    getTotalCount() {
        return Object.keys(ACHIEVEMENTS).length;
    }

    getAllAchievements() {
        return Object.values(ACHIEVEMENTS).map(achievement => ({
            ...achievement,
            unlocked: this.isUnlocked(achievement.id)
        }));
    }

    getNewlyUnlocked() {
        return this.newlyUnlocked;
    }

    clearNewlyUnlocked() {
        this.newlyUnlocked = [];
    }
}
