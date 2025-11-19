import { CONFIG, POWERUP_TYPES } from './GameConfig.js';
import PowerUp from '../entities/PowerUp.js';

export default class PowerUpManager {
    constructor(scene) {
        this.scene = scene;
        this.fibonacciSequence = CONFIG.FIBONACCI_SEQUENCE;
        this.currentFibIndex = 0;
        this.nextPowerUpScore = this.fibonacciSequence[0] * 10; // First at score 10
        this.powerUpGroup = null;
    }

    setGroup(group) {
        this.powerUpGroup = group;
    }

    checkForPowerUpSpawn(currentScore) {
        if (currentScore >= this.nextPowerUpScore) {
            // Spawn power-up at random X position at top
            const x = Phaser.Math.Between(50, 750);
            const y = -20;

            this.spawnPowerUp(x, y);

            // Show notification
            this.showPowerUpIncoming();

            // Calculate next threshold
            this.currentFibIndex++;
            if (this.currentFibIndex >= this.fibonacciSequence.length) {
                this.currentFibIndex = this.fibonacciSequence.length - 1;
            }

            // Accumulate Fibonacci values for next threshold
            let total = 0;
            for (let i = 0; i <= this.currentFibIndex; i++) {
                total += this.fibonacciSequence[i];
            }
            this.nextPowerUpScore = total * 10;
        }
    }

    spawnPowerUp(x, y) {
        // Get random power-up type
        const types = Object.keys(POWERUP_TYPES);
        const randomType = types[Phaser.Math.Between(0, types.length - 1)];

        // Create power-up
        const powerUp = new PowerUp(this.scene, x, y, randomType);

        if (this.powerUpGroup) {
            this.powerUpGroup.add(powerUp);
        }

        return powerUp;
    }

    showPowerUpIncoming() {
        const text = this.scene.add.text(400, 100, 'POWER-UP INCOMING!', {
            fontSize: '24px',
            fill: '#ff00ff',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.scene.tweens.add({
            targets: text,
            alpha: 0,
            y: 50,
            duration: 1500,
            onComplete: () => text.destroy()
        });
    }

    getNextPowerUpInfo() {
        return {
            pointsNeeded: this.nextPowerUpScore,
            powerUpNumber: this.currentFibIndex + 1
        };
    }

    reset() {
        this.currentFibIndex = 0;
        this.nextPowerUpScore = this.fibonacciSequence[0] * 10;
    }
}
