export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    init(data) {
        this.finalScore = data.score || 0;
        this.shotsFired = data.shotsFired || 0;
        this.correctHits = data.correctHits || 0;
        this.wrongHits = data.wrongHits || 0;
        this.waveReached = data.wave || 1;
        this.sessionStats = data.sessionStats || {};
        this.newAchievements = data.newAchievements || [];
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

        // Game Over title
        this.add.text(400, 60, 'GAME OVER', {
            fontSize: '56px',
            fill: '#ff0000',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Wave reached
        this.add.text(400, 120, `Wave Reached: ${this.waveReached}`, {
            fontSize: '28px',
            fill: '#00ffff',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Final score
        this.add.text(400, 165, `Final Score: ${this.finalScore}`, {
            fontSize: '36px',
            fill: '#ffff00',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Statistics
        const accuracy = this.shotsFired > 0
            ? Math.round((this.correctHits / this.shotsFired) * 100)
            : 0;

        const stats = [
            `Total Shots: ${this.shotsFired}`,
            `Correct Hits: ${this.correctHits}`,
            `Wrong Hits: ${this.wrongHits}`,
            `Accuracy: ${accuracy}%`
        ];

        stats.forEach((text, index) => {
            this.add.text(400, 220 + index * 32, text, {
                fontSize: '20px',
                fill: '#ffffff',
                fontFamily: 'Courier New',
                stroke: '#000000',
                strokeThickness: 2
            }).setOrigin(0.5);
        });

        // Show new achievements if any
        if (this.newAchievements.length > 0) {
            this.add.text(400, 360, 'NEW ACHIEVEMENTS!', {
                fontSize: '18px',
                fill: '#ffd700',
                fontFamily: 'Courier New',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 2
            }).setOrigin(0.5);

            const achievementText = this.newAchievements
                .map(a => `${a.icon} ${a.name}`)
                .join('  ');

            this.add.text(400, 385, achievementText, {
                fontSize: '12px',
                fill: '#ffffff',
                fontFamily: 'Courier New'
            }).setOrigin(0.5);
        }

        // Play Again button
        const playAgainButton = this.add.text(200, 440, 'PLAY AGAIN', {
            fontSize: '22px',
            fill: '#00ff00',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3,
            backgroundColor: '#003300',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        playAgainButton.on('pointerover', () => {
            playAgainButton.setStyle({ fill: '#ffffff', backgroundColor: '#006600' });
            playAgainButton.setScale(1.1);
        });

        playAgainButton.on('pointerout', () => {
            playAgainButton.setStyle({ fill: '#00ff00', backgroundColor: '#003300' });
            playAgainButton.setScale(1);
        });

        playAgainButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        // View Stats button
        const statsButton = this.add.text(400, 440, 'VIEW STATS', {
            fontSize: '22px',
            fill: '#00ffff',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3,
            backgroundColor: '#003333',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        statsButton.on('pointerover', () => {
            statsButton.setStyle({ fill: '#ffffff', backgroundColor: '#006666' });
            statsButton.setScale(1.1);
        });

        statsButton.on('pointerout', () => {
            statsButton.setStyle({ fill: '#00ffff', backgroundColor: '#003333' });
            statsButton.setScale(1);
        });

        statsButton.on('pointerdown', () => {
            this.scene.start('StatsScene', {
                score: this.finalScore,
                wave: this.waveReached,
                sessionStats: this.sessionStats,
                newAchievements: this.newAchievements
            });
        });

        // Main Menu button
        const menuButton = this.add.text(600, 440, 'MENU', {
            fontSize: '22px',
            fill: '#ffff00',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3,
            backgroundColor: '#333300',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        menuButton.on('pointerover', () => {
            menuButton.setStyle({ fill: '#ffffff', backgroundColor: '#666600' });
            menuButton.setScale(1.1);
        });

        menuButton.on('pointerout', () => {
            menuButton.setStyle({ fill: '#ffff00', backgroundColor: '#333300' });
            menuButton.setScale(1);
        });

        menuButton.on('pointerdown', () => {
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
