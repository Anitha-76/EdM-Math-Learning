import { CONFIG, POWERUP_TYPES } from '../utils/GameConfig.js';

export default class PowerUp extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, 'powerup');

        // Add to scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Properties
        this.powerUpType = type;
        this.typeConfig = POWERUP_TYPES[type];

        // Create visual representation
        this.createVisual();

        // Set velocity to fall downward
        this.setVelocityY(CONFIG.POWERUP_FALL_SPEED);

        // Pulsing animation
        scene.tweens.add({
            targets: this,
            scale: 1.2,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }

    createVisual() {
        // Create colored circle based on type
        const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });

        // Outer glow
        graphics.fillStyle(this.typeConfig.color, 0.5);
        graphics.fillCircle(20, 20, 20);

        // Inner circle
        graphics.fillStyle(this.typeConfig.color, 1);
        graphics.fillCircle(20, 20, 15);

        // White center
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(20, 20, 8);

        graphics.generateTexture('powerup_' + this.powerUpType, 40, 40);
        graphics.destroy();

        this.setTexture('powerup_' + this.powerUpType);

        // Add icon text
        this.iconText = this.scene.add.text(this.x, this.y, this.typeConfig.icon, {
            fontSize: '16px',
            fill: '#000000',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    update() {
        // Update icon position
        if (this.iconText && this.iconText.active) {
            this.iconText.setPosition(this.x, this.y);
        }

        // Rotate for visual effect
        this.rotation += 0.02;

        // Destroy if off bottom of screen
        if (this.y > 620) {
            this.destroy();
        }
    }

    activate(player) {
        // Show floating text with power-up name
        this.scene.showFloatingText(this.x, this.y, this.typeConfig.name, '#ff00ff');

        // Apply effect to player
        player.activatePowerUp(this.powerUpType);

        // Destroy self
        this.destroy();
    }

    destroy(fromScene) {
        // Destroy icon text
        if (this.iconText) {
            this.iconText.destroy();
        }
        super.destroy(fromScene);
    }
}
