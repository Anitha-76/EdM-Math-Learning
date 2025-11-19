export default class StatsScene extends Phaser.Scene {
    constructor() {
        super('StatsScene');
    }

    init(data) {
        this.finalScore = data.score || 0;
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

        // Title
        this.add.text(400, 30, 'DETAILED STATISTICS', {
            fontSize: '36px',
            fill: '#00ffff',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Score and Wave
        this.add.text(400, 70, `Final Score: ${this.finalScore}  |  Wave: ${this.waveReached}`, {
            fontSize: '20px',
            fill: '#ffff00',
            fontFamily: 'Courier New',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Create two columns
        this.createLeftColumn();
        this.createRightColumn();

        // New achievements section
        if (this.newAchievements.length > 0) {
            this.createAchievementsSection();
        }

        // Navigation buttons
        this.createButtons();
    }

    createLeftColumn() {
        const startY = 110;
        const x = 200;
        let y = startY;

        // Combat Stats
        this.addSectionHeader(x, y, 'COMBAT STATS');
        y += 30;

        const combatStats = [
            `Shots Fired: ${this.sessionStats.shotsFired || 0}`,
            `Primes Destroyed: ${this.sessionStats.correctHits || 0}`,
            `Composites Hit: ${this.sessionStats.wrongHits || 0}`,
            `Primes Missed: ${this.sessionStats.missedPrimes || 0}`,
            `Accuracy: ${this.sessionStats.accuracy || 0}%`
        ];

        combatStats.forEach(text => {
            this.addStatText(x, y, text);
            y += 22;
        });

        // Streak Stats
        y += 15;
        this.addSectionHeader(x, y, 'STREAKS & COMBOS');
        y += 30;

        const streakStats = [
            `Max Prime Streak: ${this.sessionStats.maxStreak || 0}`,
            `Max Combo: ${this.sessionStats.maxCombo || 0}x`,
            `Perfect Waves: ${this.sessionStats.perfectWaves || 0}`
        ];

        streakStats.forEach(text => {
            this.addStatText(x, y, text);
            y += 22;
        });

        // Time Stats
        y += 15;
        this.addSectionHeader(x, y, 'TIME');
        y += 30;

        this.addStatText(x, y, `Duration: ${this.sessionStats.gameDuration || '0:00'}`);
        y += 22;
        this.addStatText(x, y, `Avg Response: ${this.sessionStats.averageResponseTime || 0}ms`);
    }

    createRightColumn() {
        const startY = 110;
        const x = 600;
        let y = startY;

        // Range Performance
        this.addSectionHeader(x, y, 'ACCURACY BY RANGE');
        y += 30;

        const rangePerf = this.sessionStats.rangePerformance || {};
        const ranges = ['2-30', '31-60', '61-100', '100+'];

        ranges.forEach(range => {
            const accuracy = rangePerf[range] || 0;
            const color = accuracy >= 80 ? '#00ff00' : accuracy >= 50 ? '#ffff00' : '#ff6666';
            this.addStatText(x, y, `${range}: ${accuracy}%`, color);
            y += 22;
        });

        // Most Missed Numbers
        y += 15;
        this.addSectionHeader(x, y, 'MOST MISSED NUMBERS');
        y += 30;

        const missed = this.sessionStats.mostMissedNumbers || [];
        if (missed.length === 0) {
            this.addStatText(x, y, 'None - Great job!', '#00ff00');
        } else {
            missed.slice(0, 4).forEach(item => {
                const factorStr = item.factors ? item.factors.join('×') : '';
                this.addStatText(x, y, `${item.number} (${item.count}x) = ${factorStr}`, '#ff9966');
                y += 22;
            });
        }

        // Power-ups and Hints
        y += 15;
        this.addSectionHeader(x, y, 'ITEMS');
        y += 30;

        this.addStatText(x, y, `Power-ups: ${this.sessionStats.powerUpsCollected || 0}`);
        y += 22;
        this.addStatText(x, y, `Hints Used: ${this.sessionStats.hintsUsed || 0}`);
    }

    createAchievementsSection() {
        this.add.text(400, 430, 'NEW ACHIEVEMENTS UNLOCKED!', {
            fontSize: '18px',
            fill: '#ffd700',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        const achievementText = this.newAchievements
            .map(a => `${a.icon} ${a.name}`)
            .join('  ');

        this.add.text(400, 455, achievementText, {
            fontSize: '14px',
            fill: '#ffffff',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
    }

    addSectionHeader(x, y, text) {
        this.add.text(x, y, text, {
            fontSize: '16px',
            fill: '#00ffff',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5, 0);
    }

    addStatText(x, y, text, color = '#ffffff') {
        this.add.text(x, y, text, {
            fontSize: '14px',
            fill: color,
            fontFamily: 'Courier New',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5, 0);
    }

    createButtons() {
        // Play Again button
        const playAgainButton = this.add.text(300, 530, 'PLAY AGAIN', {
            fontSize: '24px',
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

        // Main Menu button
        const menuButton = this.add.text(500, 530, 'MAIN MENU', {
            fontSize: '24px',
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
