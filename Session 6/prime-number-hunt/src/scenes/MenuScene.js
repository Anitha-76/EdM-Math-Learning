export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        // Load lifetime stats for high score display
        this.loadStats();

        // Create animated starfield background
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

        // Game title
        this.add.text(400, 80, 'PRIME NUMBER HUNT', {
            fontSize: '48px',
            fill: '#00ffff',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // High score display
        if (this.lifetimeStats.highScore > 0) {
            this.add.text(400, 125, `High Score: ${this.lifetimeStats.highScore}  |  Best Wave: ${this.lifetimeStats.highestWave}`, {
                fontSize: '16px',
                fill: '#ffd700',
                fontFamily: 'Courier New',
                stroke: '#000000',
                strokeThickness: 2
            }).setOrigin(0.5);
        }

        // Instructions
        const instructions = [
            'Destroy ships with PRIME numbers only!',
            'Arrow Keys/WASD: Move | SPACE: Shoot | H: Hint',
            'Hitting composite numbers costs a life!'
        ];

        instructions.forEach((text, index) => {
            this.add.text(400, 160 + index * 24, text, {
                fontSize: '14px',
                fill: '#ffffff',
                fontFamily: 'Courier New',
                stroke: '#000000',
                strokeThickness: 2
            }).setOrigin(0.5);
        });

        // Menu buttons
        let yPos = 260;

        // Play button -> Mode Select
        const playButton = this.add.text(400, yPos, 'PLAY', {
            fontSize: '32px',
            fill: '#00ff00',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3,
            backgroundColor: '#003300',
            padding: { x: 30, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        playButton.on('pointerover', () => {
            playButton.setStyle({ fill: '#ffffff', backgroundColor: '#006600' });
            playButton.setScale(1.1);
        });
        playButton.on('pointerout', () => {
            playButton.setStyle({ fill: '#00ff00', backgroundColor: '#003300' });
            playButton.setScale(1);
        });
        playButton.on('pointerdown', () => {
            this.scene.start('ModeSelectScene');
        });

        yPos += 60;

        // Leaderboards button
        const leaderboardButton = this.add.text(400, yPos, 'LEADERBOARDS', {
            fontSize: '22px',
            fill: '#ffd700',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        leaderboardButton.on('pointerover', () => leaderboardButton.setScale(1.1));
        leaderboardButton.on('pointerout', () => leaderboardButton.setScale(1));
        leaderboardButton.on('pointerdown', () => {
            this.scene.start('LeaderboardScene');
        });

        yPos += 45;

        // Achievements button
        const achievementsButton = this.add.text(400, yPos, 'ACHIEVEMENTS', {
            fontSize: '22px',
            fill: '#ff66ff',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // Show achievement progress
        const unlocked = Object.keys(this.unlockedAchievements).length;
        this.add.text(530, yPos, `${unlocked}/10`, {
            fontSize: '12px',
            fill: '#888888',
            fontFamily: 'Courier New'
        }).setOrigin(0, 0.5);

        achievementsButton.on('pointerover', () => achievementsButton.setScale(1.1));
        achievementsButton.on('pointerout', () => achievementsButton.setScale(1));
        achievementsButton.on('pointerdown', () => {
            this.scene.start('AchievementsScene');
        });

        yPos += 45;

        // Settings button
        const settingsButton = this.add.text(400, yPos, 'SETTINGS', {
            fontSize: '22px',
            fill: '#00ffff',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        settingsButton.on('pointerover', () => settingsButton.setScale(1.1));
        settingsButton.on('pointerout', () => settingsButton.setScale(1));
        settingsButton.on('pointerdown', () => {
            this.scene.start('SettingsScene');
        });

        // Prime numbers hint
        this.add.text(400, 570, 'Prime numbers: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29...', {
            fontSize: '12px',
            fill: '#00aaff',
            fontFamily: 'Courier New',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);
    }

    loadStats() {
        // Load lifetime stats
        const savedStats = localStorage.getItem('primeHuntLifetimeStats');
        if (savedStats) {
            this.lifetimeStats = JSON.parse(savedStats);
        } else {
            this.lifetimeStats = { highScore: 0, highestWave: 0 };
        }

        // Load achievements
        const savedAchievements = localStorage.getItem('primeHuntAchievements');
        if (savedAchievements) {
            this.unlockedAchievements = JSON.parse(savedAchievements);
        } else {
            this.unlockedAchievements = {};
        }
    }

    update() {
        // Animate stars falling
        this.stars.forEach(star => {
            star.y += star.speed;
            if (star.y > 600) {
                star.y = 0;
                star.x = Phaser.Math.Between(0, 800);
            }
        });
    }
}
