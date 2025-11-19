import { DIFFICULTY_LEVELS } from '../utils/GameConfig.js';
import DifficultyManager from '../utils/DifficultyManager.js';
import SoundManager from '../utils/SoundManager.js';

export default class SettingsScene extends Phaser.Scene {
    constructor() {
        super('SettingsScene');
    }

    create() {
        this.difficultyManager = new DifficultyManager();
        this.soundManager = new SoundManager(this);

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

        this.add.text(400, 40, 'SETTINGS', {
            fontSize: '36px',
            fill: '#00ffff',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        let yPos = 120;

        // Difficulty Setting
        this.add.text(150, yPos, 'Difficulty:', {
            fontSize: '22px',
            fill: '#ffffff',
            fontFamily: 'Courier New'
        });

        yPos += 40;
        const difficulties = ['EASY', 'NORMAL', 'HARD', 'EXPERT'];
        const currentDiff = this.difficultyManager.getDifficulty();

        let xPos = 150;
        difficulties.forEach(diff => {
            const isActive = diff === currentDiff;
            const btn = this.add.text(xPos, yPos, diff, {
                fontSize: '14px',
                fill: isActive ? '#00ff00' : '#888888',
                fontFamily: 'Courier New',
                backgroundColor: isActive ? '#003300' : '#222222',
                padding: { x: 10, y: 6 }
            }).setInteractive({ useHandCursor: true });

            btn.on('pointerdown', () => {
                this.difficultyManager.setDifficulty(diff);
                this.scene.restart();
            });

            xPos += 110;
        });

        yPos += 70;

        // Sound Settings
        this.add.text(150, yPos, 'Sound Effects:', {
            fontSize: '22px',
            fill: '#ffffff',
            fontFamily: 'Courier New'
        });

        yPos += 40;
        const soundToggle = this.add.text(150, yPos,
            this.soundManager.soundEnabled ? 'ON' : 'OFF', {
            fontSize: '16px',
            fill: this.soundManager.soundEnabled ? '#00ff00' : '#ff0000',
            fontFamily: 'Courier New',
            backgroundColor: '#222222',
            padding: { x: 15, y: 8 }
        }).setInteractive({ useHandCursor: true });

        soundToggle.on('pointerdown', () => {
            this.soundManager.setSoundEnabled(!this.soundManager.soundEnabled);
            this.scene.restart();
        });

        yPos += 60;

        // Music Settings
        this.add.text(150, yPos, 'Music:', {
            fontSize: '22px',
            fill: '#ffffff',
            fontFamily: 'Courier New'
        });

        yPos += 40;
        const musicToggle = this.add.text(150, yPos,
            this.soundManager.musicEnabled ? 'ON' : 'OFF', {
            fontSize: '16px',
            fill: this.soundManager.musicEnabled ? '#00ff00' : '#ff0000',
            fontFamily: 'Courier New',
            backgroundColor: '#222222',
            padding: { x: 15, y: 8 }
        }).setInteractive({ useHandCursor: true });

        musicToggle.on('pointerdown', () => {
            this.soundManager.setMusicEnabled(!this.soundManager.musicEnabled);
            this.scene.restart();
        });

        yPos += 80;

        // Reset Data
        this.add.text(150, yPos, 'Data Management:', {
            fontSize: '22px',
            fill: '#ffffff',
            fontFamily: 'Courier New'
        });

        yPos += 40;
        const resetBtn = this.add.text(150, yPos, 'RESET ALL DATA', {
            fontSize: '16px',
            fill: '#ff0000',
            fontFamily: 'Courier New',
            backgroundColor: '#330000',
            padding: { x: 15, y: 8 }
        }).setInteractive({ useHandCursor: true });

        resetBtn.on('pointerover', () => resetBtn.setScale(1.05));
        resetBtn.on('pointerout', () => resetBtn.setScale(1));
        resetBtn.on('pointerdown', () => {
            if (confirm('Are you sure? This will delete all scores and progress!')) {
                localStorage.clear();
                alert('All data cleared!');
                this.scene.start('MenuScene');
            }
        });

        // Back button
        const backBtn = this.add.text(400, 540, 'BACK TO MENU', {
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
