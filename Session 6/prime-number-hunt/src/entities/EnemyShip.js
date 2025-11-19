import { CONFIG } from '../utils/GameConfig.js';
import { isPrime } from '../utils/MathHelpers.js';

export default class EnemyShip extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, number, speed = CONFIG.ENEMY_SPEED) {
        // Use different texture based on whether number is prime
        const texture = isPrime(number) ? 'enemyPrime' : 'enemy';
        super(scene, x, y, texture);

        // Add to scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Properties
        this.number = number;
        this.isPrime = isPrime(number);
        this.speed = speed;

        // Create number text
        this.numberText = scene.add.text(x, y, number.toString(), {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Set velocity to move downward
        this.setVelocityY(this.speed);

        // Fade in effect
        this.setAlpha(0);
        scene.tweens.add({
            targets: [this, this.numberText],
            alpha: 1,
            duration: 300
        });
    }

    update() {
        // Update text position to follow ship
        if (this.numberText && this.numberText.active) {
            this.numberText.setPosition(this.x, this.y);
        }
    }

    destroy(fromScene) {
        // Destroy the number text when enemy is destroyed
        if (this.numberText) {
            this.numberText.destroy();
        }
        super.destroy(fromScene);
    }

    getNumber() {
        return this.number;
    }

    checkIsPrime() {
        return this.isPrime;
    }
}
