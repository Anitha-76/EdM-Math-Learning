export default class ModeSelectScene extends Phaser.Scene {
    constructor() {
        super('ModeSelectScene');
    }

    create() {
        // Create starfield background
        this.stars = [];
        for (let i = 0; i < 100; i++) {
            const star = this.add.image(
                Phaser.Math.Between(0, 800),
                Phaser.Math.Between(0, 600),
                'star'
            );
            star.setAlpha(Phaser.Math.FloatBetween(0.3, 1));
            star.speed = Phaser.Math.FloatBetween(0.5, 2);
            this.stars.push(star);
        }

        // Title
        this.add.text(400, 50, 'SELECT GAME MODE', {
            fontSize: '40px',
            fill: '#00ffff',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Mode cards
        const modes = [
            {
                name: 'CLASSIC',
                key: 'classic',
                icon: '🎯',
                description: 'Wave-based progression with power-ups',
                color: 0x0066cc,
                scene: 'GameScene'
            },
            {
                name: 'TIME ATTACK',
                key: 'time_attack',
                icon: '⏱️',
                description: '60 seconds - destroy as many primes as possible!',
                color: 0xff6600,
                scene: 'TimeAttackScene'
            },
            {
                name: 'ENDLESS',
                key: 'endless',
                icon: '♾️',
                description: 'Survive as long as you can. Difficulty increases!',
                color: 0x9900cc,
                scene: 'EndlessScene'
            },
            {
                name: 'CHALLENGE',
                key: 'challenge',
                icon: '🏆',
                description: 'Special prime categories and unique challenges',
                color: 0xccaa00,
                scene: 'ChallengeScene'
            }
        ];

        let yPos = 150;
        modes.forEach(mode => {
            this.createModeCard(mode, yPos);
            yPos += 110;
        });

        // Back button
        const backBtn = this.add.text(400, 560, 'BACK TO MENU', {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Courier New',
            backgroundColor: '#333333',
            padding: { x: 20, y: 8 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        backBtn.on('pointerover', () => backBtn.setScale(1.1));
        backBtn.on('pointerout', () => backBtn.setScale(1));
        backBtn.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }

    createModeCard(mode, y) {
        // Card background
        const card = this.add.rectangle(400, y, 700, 90, mode.color, 0.3)
            .setStrokeStyle(3, mode.color)
            .setInteractive({ useHandCursor: true });

        // Icon
        this.add.text(120, y, mode.icon, {
            fontSize: '48px'
        }).setOrigin(0.5);

        // Name
        this.add.text(200, y - 20, mode.name, {
            fontSize: '28px',
            fill: '#ffffff',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);

        // Description
        this.add.text(200, y + 15, mode.description, {
            fontSize: '14px',
            fill: '#cccccc',
            fontFamily: 'Courier New'
        }).setOrigin(0, 0.5);

        // Hover effects
        card.on('pointerover', () => {
            card.setFillStyle(mode.color, 0.6);
            card.setScale(1.02);
        });

        card.on('pointerout', () => {
            card.setFillStyle(mode.color, 0.3);
            card.setScale(1);
        });

        card.on('pointerdown', () => {
            this.registry.set('gameMode', mode.key);
            this.scene.start(mode.scene);
        });
    }

    update() {
        // Animate stars
        this.stars.forEach(star => {
            star.y += star.speed;
            if (star.y > 600) {
                star.y = 0;
                star.x = Phaser.Math.Between(0, 800);
            }
        });
    }
}
