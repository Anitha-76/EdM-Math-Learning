import { CONFIG } from '../utils/GameConfig.js';

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bullet');

        // Add to scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set velocity to move upward
        this.setVelocityY(-CONFIG.BULLET_SPEED);
    }
}
