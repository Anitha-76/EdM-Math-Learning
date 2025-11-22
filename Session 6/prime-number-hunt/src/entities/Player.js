import { CONFIG, POWERUP_TYPES } from '../utils/GameConfig.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture = 'player') {
        super(scene, x, y, texture);

        // Add to scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Properties
        this.speed = CONFIG.PLAYER_SPEED;
        this.fireRate = CONFIG.PLAYER_FIRE_RATE;
        this.baseFireRate = CONFIG.PLAYER_FIRE_RATE;
        this.lastFired = 0;
        this.lives = CONFIG.STARTING_LIVES;

        // Power-up states
        this.hasShield = false;
        this.slowMotionActive = false;
        this.primeVisionActive = false;
        this.rapidFireActive = false;
        this.scoreMultiplierActive = false;
        this.freezeActive = false;

        this.powerUpTimers = {};

        // Set collision body
        this.setCollideWorldBounds(true);
        this.body.setSize(34, 40);
        this.body.setOffset(8, 8);
    }

    update(cursors, wasd) {
        // Reset velocity
        this.setVelocity(0);

        // Horizontal movement
        if (cursors.left.isDown || wasd.left.isDown) {
            this.setVelocityX(-this.speed);
        } else if (cursors.right.isDown || wasd.right.isDown) {
            this.setVelocityX(this.speed);
        }

        // Vertical movement
        if (cursors.up.isDown || wasd.up.isDown) {
            this.setVelocityY(-this.speed);
        } else if (cursors.down.isDown || wasd.down.isDown) {
            this.setVelocityY(this.speed);
        }
    }

    shoot(time) {
        if (time > this.lastFired) {
            this.lastFired = time + this.fireRate;
            return true;
        }
        return false;
    }

    activatePowerUp(type) {
        switch (type) {
            case 'SHIELD':
                this.hasShield = true;
                this.setTint(0x00ffff);
                this.scene.showPowerUpNotification('Shield Active!');
                break;

            case 'SLOW_MOTION':
                this.slowMotionActive = true;
                // Reduce all enemy speeds to 50%
                this.scene.enemies.getChildren().forEach(enemy => {
                    if (enemy.active) {
                        enemy.setVelocityY(enemy.body.velocity.y * 0.5);
                    }
                });
                this.scene.showPowerUpNotification('Slow Motion!');
                this.startPowerUpTimer('SLOW_MOTION', 5000);
                break;

            case 'PRIME_VISION':
                this.primeVisionActive = true;
                // Highlight all prime enemies
                this.scene.enemies.getChildren().forEach(enemy => {
                    if (enemy.active && enemy.isPrime) {
                        enemy.setTint(0x00ff00);
                        if (enemy.numberText) {
                            enemy.numberText.setStyle({ fill: '#00ff00' });
                        }
                    }
                });
                this.scene.showPowerUpNotification('Prime Vision!');
                this.startPowerUpTimer('PRIME_VISION', 3000);
                break;

            case 'RAPID_FIRE':
                this.rapidFireActive = true;
                this.fireRate = this.baseFireRate / 2;
                this.scene.showPowerUpNotification('Rapid Fire!');
                this.startPowerUpTimer('RAPID_FIRE', 5000);
                break;

            case 'SCORE_MULTIPLIER':
                this.scoreMultiplierActive = true;
                this.scene.showPowerUpNotification('2x Score!');
                this.startPowerUpTimer('SCORE_MULTIPLIER', 10000);
                break;

            case 'LIFE_RESTORE':
                this.lives = Math.min(this.lives + 1, 5);
                this.scene.updateLivesDisplay();
                this.scene.showPowerUpNotification('Extra Life!');
                break;

            case 'FREEZE':
                this.freezeActive = true;
                // Stop all enemies
                this.scene.enemies.getChildren().forEach(enemy => {
                    if (enemy.active) {
                        enemy.setVelocity(0, 0);
                        enemy.setTint(0x66ccff);
                    }
                });
                this.scene.showPowerUpNotification('Freeze!');
                this.startPowerUpTimer('FREEZE', 3000);
                break;
        }
    }

    startPowerUpTimer(type, duration) {
        // Clear existing timer if any
        if (this.powerUpTimers[type]) {
            this.powerUpTimers[type].remove();
        }

        // Create new timer
        this.powerUpTimers[type] = this.scene.time.delayedCall(duration, () => {
            this.deactivatePowerUp(type);
        });
    }

    deactivatePowerUp(type) {
        switch (type) {
            case 'SLOW_MOTION':
                this.slowMotionActive = false;
                // Restore enemy speeds
                const difficulty = this.scene.waveManager.getCurrentDifficulty();
                this.scene.enemies.getChildren().forEach(enemy => {
                    if (enemy.active) {
                        enemy.setVelocityY(difficulty.enemySpeed);
                    }
                });
                break;

            case 'PRIME_VISION':
                this.primeVisionActive = false;
                // Remove highlights
                this.scene.enemies.getChildren().forEach(enemy => {
                    if (enemy.active) {
                        enemy.clearTint();
                        if (enemy.numberText) {
                            enemy.numberText.setStyle({ fill: '#ffffff' });
                        }
                    }
                });
                break;

            case 'RAPID_FIRE':
                this.rapidFireActive = false;
                this.fireRate = this.baseFireRate;
                break;

            case 'SCORE_MULTIPLIER':
                this.scoreMultiplierActive = false;
                break;

            case 'FREEZE':
                this.freezeActive = false;
                // Restore enemy movement
                const diff = this.scene.waveManager.getCurrentDifficulty();
                this.scene.enemies.getChildren().forEach(enemy => {
                    if (enemy.active) {
                        enemy.clearTint();
                        enemy.setVelocityY(diff.enemySpeed);
                    }
                });
                break;
        }

        // Show notification
        this.scene.showFloatingText(this.x, this.y - 30, 'Power-up ended', '#888888');
    }

    takeDamage() {
        if (this.hasShield) {
            // Shield absorbs hit
            this.hasShield = false;
            this.clearTint();
            this.scene.showFloatingText(this.x, this.y - 30, 'Shield blocked!', '#00ffff');
            return this.lives; // Don't lose life
        }

        this.lives--;

        // Visual damage feedback - red flash
        this.setTint(0xff0000);
        this.scene.time.delayedCall(200, () => {
            if (!this.hasShield) {
                this.clearTint();
            } else {
                this.setTint(0x00ffff);
            }
        });

        return this.lives;
    }

    getLives() {
        return this.lives;
    }

    resetLives() {
        this.lives = CONFIG.STARTING_LIVES;
    }

    resetPowerUps() {
        this.hasShield = false;
        this.slowMotionActive = false;
        this.primeVisionActive = false;
        this.rapidFireActive = false;
        this.scoreMultiplierActive = false;
        this.freezeActive = false;
        this.fireRate = this.baseFireRate;
        this.clearTint();

        // Clear all timers
        Object.values(this.powerUpTimers).forEach(timer => {
            if (timer) timer.remove();
        });
        this.powerUpTimers = {};
    }
}
