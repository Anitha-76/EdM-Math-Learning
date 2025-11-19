import { CONFIG } from './GameConfig.js';

export default class WaveManager {
    constructor(scene) {
        this.scene = scene;
        this.currentWave = 1;
        this.enemiesSpawnedThisWave = 0;
        this.enemiesDestroyedThisWave = 0;
        this.enemiesToSpawnThisWave = CONFIG.ENEMIES_PER_WAVE_BASE;
        this.waveInProgress = false;
        this.waveComplete = false;
    }

    getCurrentDifficulty() {
        const wave = this.currentWave;

        return {
            numberRangeMax: Math.min(
                CONFIG.NUMBER_RANGE_MAX + (wave - 1) * CONFIG.NUMBER_RANGE_INCREASE_PER_WAVE,
                CONFIG.MAX_NUMBER_RANGE
            ),
            enemySpeed: CONFIG.ENEMY_SPEED + (wave - 1) * CONFIG.SPEED_INCREASE_PER_WAVE,
            spawnRate: Math.max(
                CONFIG.ENEMY_SPAWN_RATE - (wave - 1) * CONFIG.SPAWN_RATE_DECREASE_PER_WAVE,
                CONFIG.MIN_SPAWN_RATE
            ),
            simultaneousEnemies: Math.min(
                CONFIG.MAX_SIMULTANEOUS_ENEMIES + Math.floor((wave - 1) / 2),
                8
            )
        };
    }

    startWave() {
        this.waveInProgress = true;
        this.waveComplete = false;
        this.enemiesSpawnedThisWave = 0;
        this.enemiesDestroyedThisWave = 0;
        this.enemiesToSpawnThisWave = CONFIG.ENEMIES_PER_WAVE_BASE +
            (this.currentWave - 1) * CONFIG.ENEMIES_PER_WAVE_INCREMENT;

        // Update spawn timer with new rate
        const difficulty = this.getCurrentDifficulty();
        if (this.scene.enemySpawnTimer) {
            this.scene.enemySpawnTimer.remove();
        }
        this.scene.enemySpawnTimer = this.scene.time.addEvent({
            delay: difficulty.spawnRate,
            callback: this.scene.spawnEnemy,
            callbackScope: this.scene,
            loop: true
        });

        // Show wave banner
        this.showWaveBanner();
    }

    showWaveBanner() {
        const banner = this.scene.add.text(400, -50, `WAVE ${this.currentWave}`, {
            fontSize: '48px',
            fill: '#00ffff',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Animate banner
        this.scene.tweens.add({
            targets: banner,
            y: 300,
            duration: 500,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.scene.time.delayedCall(1000, () => {
                    this.scene.tweens.add({
                        targets: banner,
                        y: -50,
                        alpha: 0,
                        duration: 500,
                        onComplete: () => banner.destroy()
                    });
                });
            }
        });
    }

    enemySpawned() {
        this.enemiesSpawnedThisWave++;

        // Stop spawning if we've reached the limit for this wave
        if (this.enemiesSpawnedThisWave >= this.enemiesToSpawnThisWave) {
            if (this.scene.enemySpawnTimer) {
                this.scene.enemySpawnTimer.remove();
            }
        }
    }

    enemyDestroyed() {
        this.enemiesDestroyedThisWave++;
    }

    canSpawnEnemy() {
        return this.enemiesSpawnedThisWave < this.enemiesToSpawnThisWave;
    }

    checkWaveComplete() {
        if (this.waveComplete || !this.waveInProgress) return;

        // Wave is complete when all enemies spawned AND all destroyed
        if (this.enemiesSpawnedThisWave >= this.enemiesToSpawnThisWave &&
            this.enemiesDestroyedThisWave >= this.enemiesToSpawnThisWave) {

            this.waveComplete = true;
            this.waveInProgress = false;

            // Award bonus
            this.scene.score += CONFIG.WAVE_CLEAR_BONUS;

            // Show completion message
            this.showWaveComplete();

            // Start next wave after delay
            this.scene.time.delayedCall(3000, () => {
                this.nextWave();
            });
        }
    }

    showWaveComplete() {
        // Play wave complete sound
        if (this.scene.soundManager) {
            this.scene.soundManager.playWaveComplete();
        }

        const completeText = this.scene.add.text(400, 250, `WAVE ${this.currentWave} COMPLETE!`, {
            fontSize: '36px',
            fill: '#00ff00',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        const bonusText = this.scene.add.text(400, 310, `+${CONFIG.WAVE_CLEAR_BONUS} BONUS`, {
            fontSize: '28px',
            fill: '#ffff00',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Animate and remove
        this.scene.tweens.add({
            targets: [completeText, bonusText],
            alpha: 0,
            y: '-=50',
            duration: 2500,
            delay: 500,
            onComplete: () => {
                completeText.destroy();
                bonusText.destroy();
            }
        });
    }

    nextWave() {
        // Record wave completion in stats tracker
        if (this.scene.statsTracker) {
            this.scene.statsTracker.recordWaveComplete();
        }

        this.currentWave++;

        // Reset hints for new wave
        if (this.scene.hintSystem) {
            this.scene.hintSystem.resetForWave(this.currentWave);
        }

        this.startWave();

        // Update wave display
        if (this.scene.waveText) {
            this.scene.waveText.setText(`Wave: ${this.currentWave}`);
        }
    }

    getWaveInfo() {
        return {
            wave: this.currentWave,
            enemiesRemaining: this.enemiesToSpawnThisWave - this.enemiesDestroyedThisWave,
            totalEnemies: this.enemiesToSpawnThisWave,
            difficulty: this.getCurrentDifficulty()
        };
    }
}
