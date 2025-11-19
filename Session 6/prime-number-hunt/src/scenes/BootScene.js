export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Show loading text
        this.loadingText = this.add.text(400, 300, 'Loading...', {
            fontSize: '32px',
            fill: '#00ffff',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
    }

    create() {
        // Create player sprite (cartoon tank)
        const playerGraphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Tank treads (dark gray)
        playerGraphics.fillStyle(0x333333, 1);
        playerGraphics.fillRoundedRect(2, 32, 12, 16, 3);  // Left tread
        playerGraphics.fillRoundedRect(36, 32, 12, 16, 3); // Right tread

        // Tread details (lighter gray)
        playerGraphics.fillStyle(0x555555, 1);
        playerGraphics.fillRect(4, 34, 8, 3);
        playerGraphics.fillRect(4, 39, 8, 3);
        playerGraphics.fillRect(4, 44, 8, 3);
        playerGraphics.fillRect(38, 34, 8, 3);
        playerGraphics.fillRect(38, 39, 8, 3);
        playerGraphics.fillRect(38, 44, 8, 3);

        // Tank body (bright green)
        playerGraphics.fillStyle(0x22cc22, 1);
        playerGraphics.fillRoundedRect(8, 24, 34, 20, 4);

        // Tank body highlight
        playerGraphics.fillStyle(0x44ff44, 1);
        playerGraphics.fillRoundedRect(10, 26, 30, 8, 2);

        // Turret base (darker green)
        playerGraphics.fillStyle(0x119911, 1);
        playerGraphics.fillCircle(25, 28, 10);

        // Turret top (green)
        playerGraphics.fillStyle(0x22cc22, 1);
        playerGraphics.fillCircle(25, 28, 7);

        // Cannon barrel (dark metal)
        playerGraphics.fillStyle(0x444444, 1);
        playerGraphics.fillRect(22, 2, 6, 20);

        // Cannon barrel highlight
        playerGraphics.fillStyle(0x666666, 1);
        playerGraphics.fillRect(23, 2, 2, 18);

        // Cannon muzzle (orange glow)
        playerGraphics.fillStyle(0xff6600, 1);
        playerGraphics.fillCircle(25, 4, 4);

        // Cannon muzzle inner (yellow)
        playerGraphics.fillStyle(0xffff00, 1);
        playerGraphics.fillCircle(25, 4, 2);

        // Circle decoration on turret
        playerGraphics.fillStyle(0xffff00, 1);
        playerGraphics.fillCircle(25, 28, 3);

        playerGraphics.generateTexture('player', 50, 50);
        playerGraphics.destroy();

        // Create enemy sprite (red/orange circle)
        const enemyGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        enemyGraphics.fillStyle(0xff6600, 1);
        enemyGraphics.fillCircle(20, 20, 20);
        enemyGraphics.generateTexture('enemy', 40, 40);
        enemyGraphics.destroy();

        // Create prime enemy sprite (cyan circle for distinction)
        const primeEnemyGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        primeEnemyGraphics.fillStyle(0x00aaff, 1);
        primeEnemyGraphics.fillCircle(20, 20, 20);
        primeEnemyGraphics.generateTexture('enemyPrime', 40, 40);
        primeEnemyGraphics.destroy();

        // Create bullet sprite (glowing energy ball)
        const bulletGraphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Outer glow (orange)
        bulletGraphics.fillStyle(0xff6600, 1);
        bulletGraphics.fillCircle(8, 8, 8);

        // Middle ring (yellow)
        bulletGraphics.fillStyle(0xffff00, 1);
        bulletGraphics.fillCircle(8, 8, 6);

        // Inner core (white hot)
        bulletGraphics.fillStyle(0xffffff, 1);
        bulletGraphics.fillCircle(8, 8, 3);

        // Sparkle highlight
        bulletGraphics.fillStyle(0xffffff, 1);
        bulletGraphics.fillCircle(6, 5, 1);

        bulletGraphics.generateTexture('bullet', 16, 16);
        bulletGraphics.destroy();

        // Create star sprite for starfield
        const starGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        starGraphics.fillStyle(0xffffff, 1);
        starGraphics.fillCircle(1, 1, 1);
        starGraphics.generateTexture('star', 2, 2);
        starGraphics.destroy();

        // Create particle sprites
        const particleGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        particleGraphics.fillStyle(0xffffff, 1);
        particleGraphics.fillCircle(3, 3, 3);
        particleGraphics.generateTexture('particle', 6, 6);
        particleGraphics.destroy();

        // Transition to menu after a brief delay
        this.time.delayedCall(500, () => {
            this.scene.start('MenuScene');
        });
    }
}
