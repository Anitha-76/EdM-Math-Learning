import LeaderboardManager from '../utils/LeaderboardManager.js';

export default class LeaderboardScene extends Phaser.Scene {
    constructor() {
        super('LeaderboardScene');
    }

    create() {
        this.leaderboardManager = new LeaderboardManager();

        // Create starfield
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

        this.add.text(400, 30, 'LEADERBOARDS', {
            fontSize: '36px',
            fill: '#ffd700',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Mode tabs
        this.currentMode = 'classic';
        this.tabs = [];
        this.createModeTabs();

        // Leaderboard container
        this.leaderboardContainer = this.add.container(0, 0);
        this.displayLeaderboard(this.currentMode);

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

    createModeTabs() {
        const modes = [
            { key: 'classic', name: 'Classic' },
            { key: 'time_attack', name: 'Time Attack' },
            { key: 'endless', name: 'Endless' }
        ];

        let xPos = 200;
        modes.forEach(mode => {
            const isActive = mode.key === this.currentMode;
            const tab = this.add.text(xPos, 80, mode.name, {
                fontSize: '16px',
                fill: isActive ? '#ffd700' : '#888888',
                fontFamily: 'Courier New',
                backgroundColor: isActive ? '#333333' : '#111111',
                padding: { x: 12, y: 6 }
            }).setInteractive({ useHandCursor: true });

            tab.on('pointerdown', () => {
                this.switchMode(mode.key);
            });

            this.tabs.push({ tab, key: mode.key });
            xPos += 150;
        });
    }

    switchMode(mode) {
        this.currentMode = mode;

        // Update tab styles
        this.tabs.forEach(({ tab, key }) => {
            const isActive = key === mode;
            tab.setStyle({
                fill: isActive ? '#ffd700' : '#888888',
                backgroundColor: isActive ? '#333333' : '#111111'
            });
        });

        // Refresh leaderboard
        this.leaderboardContainer.removeAll(true);
        this.displayLeaderboard(mode);
    }

    displayLeaderboard(mode) {
        const board = this.leaderboardManager.getLeaderboard(mode);

        if (board.length === 0) {
            const noScores = this.add.text(400, 300, 'No scores yet!\nBe the first!', {
                fontSize: '24px',
                fill: '#888888',
                fontFamily: 'Courier New',
                align: 'center'
            }).setOrigin(0.5);
            this.leaderboardContainer.add(noScores);
            return;
        }

        // Headers
        const headers = [
            this.add.text(80, 120, 'RANK', { fontSize: '14px', fill: '#888888', fontFamily: 'Courier New' }),
            this.add.text(180, 120, 'NAME', { fontSize: '14px', fill: '#888888', fontFamily: 'Courier New' }),
            this.add.text(450, 120, 'SCORE', { fontSize: '14px', fill: '#888888', fontFamily: 'Courier New' }),
            this.add.text(600, 120, 'DATE', { fontSize: '14px', fill: '#888888', fontFamily: 'Courier New' })
        ];
        headers.forEach(h => this.leaderboardContainer.add(h));

        let yPos = 155;
        board.forEach((entry, index) => {
            const rank = index + 1;
            let rankColor = '#ffffff';
            let medal = '';

            if (rank === 1) {
                rankColor = '#ffd700';
                medal = '🥇 ';
            } else if (rank === 2) {
                rankColor = '#c0c0c0';
                medal = '🥈 ';
            } else if (rank === 3) {
                rankColor = '#cd7f32';
                medal = '🥉 ';
            }

            const rankText = this.add.text(80, yPos, `${medal}#${rank}`, {
                fontSize: '16px',
                fill: rankColor,
                fontFamily: 'Courier New',
                fontStyle: 'bold'
            });

            const nameText = this.add.text(180, yPos, entry.name.substring(0, 12), {
                fontSize: '16px',
                fill: '#ffffff',
                fontFamily: 'Courier New'
            });

            const scoreText = this.add.text(450, yPos, entry.score.toString(), {
                fontSize: '16px',
                fill: '#00ff00',
                fontFamily: 'Courier New',
                fontStyle: 'bold'
            });

            const date = new Date(entry.date);
            const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
            const dateText = this.add.text(600, yPos, dateStr, {
                fontSize: '14px',
                fill: '#888888',
                fontFamily: 'Courier New'
            });

            this.leaderboardContainer.add([rankText, nameText, scoreText, dateText]);
            yPos += 35;
        });
    }

    update() {
        this.stars.forEach(star => {
            star.y += star.speed;
            if (star.y > 600) {
                star.y = 0;
                star.x = Phaser.Math.Between(0, 800);
            }
        });
    }
}
