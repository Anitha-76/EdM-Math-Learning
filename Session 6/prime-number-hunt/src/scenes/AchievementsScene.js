import { ACHIEVEMENTS } from '../utils/GameConfig.js';

export default class AchievementsScene extends Phaser.Scene {
    constructor() {
        super('AchievementsScene');
    }

    create() {
        // Load achievements
        this.loadAchievements();

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
        this.add.text(400, 40, 'ACHIEVEMENTS', {
            fontSize: '48px',
            fill: '#ffd700',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Progress
        const unlocked = Object.keys(this.unlockedAchievements).length;
        const total = Object.keys(ACHIEVEMENTS).length;
        this.add.text(400, 85, `${unlocked}/${total} Unlocked`, {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Courier New',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Create achievement grid
        this.createAchievementGrid();

        // Back button
        this.createBackButton();
    }

    loadAchievements() {
        const saved = localStorage.getItem('primeHuntAchievements');
        this.unlockedAchievements = saved ? JSON.parse(saved) : {};
    }

    createAchievementGrid() {
        const achievements = Object.values(ACHIEVEMENTS);
        const cols = 2;
        const startX = 200;
        const startY = 130;
        const cardWidth = 350;
        const cardHeight = 70;
        const paddingX = 20;
        const paddingY = 10;

        achievements.forEach((achievement, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = startX + col * (cardWidth + paddingX);
            const y = startY + row * (cardHeight + paddingY);

            this.createAchievementCard(x, y, cardWidth, cardHeight, achievement);
        });
    }

    createAchievementCard(x, y, width, height, achievement) {
        const isUnlocked = this.unlockedAchievements[achievement.id] === true;

        // Card background
        const bgColor = isUnlocked ? 0x1a3300 : 0x1a1a1a;
        const borderColor = isUnlocked ? 0x00ff00 : 0x333333;

        const bg = this.add.rectangle(x, y, width, height, bgColor);
        bg.setStrokeStyle(2, borderColor);

        // Icon
        const iconAlpha = isUnlocked ? 1 : 0.3;
        const icon = this.add.text(x - width/2 + 35, y, achievement.icon, {
            fontSize: '32px'
        }).setOrigin(0.5).setAlpha(iconAlpha);

        // Name
        const nameColor = isUnlocked ? '#ffffff' : '#666666';
        const name = this.add.text(x - width/2 + 70, y - 15, achievement.name, {
            fontSize: '16px',
            fill: nameColor,
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);

        // Description
        const descColor = isUnlocked ? '#aaaaaa' : '#444444';
        const desc = this.add.text(x - width/2 + 70, y + 10, achievement.description, {
            fontSize: '12px',
            fill: descColor,
            fontFamily: 'Courier New',
            wordWrap: { width: width - 90 }
        }).setOrigin(0, 0.5);

        // Locked indicator
        if (!isUnlocked) {
            const lock = this.add.text(x + width/2 - 20, y, '🔒', {
                fontSize: '20px'
            }).setOrigin(0.5).setAlpha(0.5);
        }
    }

    createBackButton() {
        const backButton = this.add.text(400, 550, 'BACK TO MENU', {
            fontSize: '28px',
            fill: '#ffff00',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3,
            backgroundColor: '#333300',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        backButton.on('pointerover', () => {
            backButton.setStyle({ fill: '#ffffff', backgroundColor: '#666600' });
            backButton.setScale(1.1);
        });

        backButton.on('pointerout', () => {
            backButton.setStyle({ fill: '#ffff00', backgroundColor: '#333300' });
            backButton.setScale(1);
        });

        backButton.on('pointerdown', () => {
            this.scene.start('MenuScene');
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
