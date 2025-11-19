import { CONFIG } from '../utils/GameConfig.js';
import { randomInt, isPrime } from '../utils/MathHelpers.js';
import Player from '../entities/Player.js';
import EnemyShip from '../entities/EnemyShip.js';
import Bullet from '../entities/Bullet.js';
import LeaderboardManager from '../utils/LeaderboardManager.js';

export default class TimeAttackScene extends Phaser.Scene {
    constructor() {
        super('TimeAttackScene');
    }

    init() {
        this.score = 0;
        this.correctHits = 0;
        this.wrongHits = 0;
        this.timeRemaining = CONFIG.TIME_ATTACK_DURATION;
        this.gameMode = 'time_attack';
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
            star.speed = Phaser.Math.FloatBetween(1, 3);
            this.stars.push(star);
        }

        // Create player
        this.player = new Player(this, 400, 560);

        // Create groups
        this.bullets = this.add.group({ classType: Bullet, maxSize: 30 });
        this.enemies = this.add.group({ classType: EnemyShip, maxSize: 15 });

        // Setup input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.input.keyboard.addCapture(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Timer display
        this.timerText = this.add.text(400, 40, this.formatTime(this.timeRemaining), {
            fontSize: '48px',
            fill: '#ffff00',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Timer bar
        this.timerBarBg = this.add.rectangle(400, 85, 600, 16, 0x333333);
        this.timerBar = this.add.rectangle(100, 85, 600, 16, 0x00ff00).setOrigin(0, 0.5);

        // Instructions
        this.add.text(400, 110, 'Correct: +0.5s | Wrong: -2s', {
            fontSize: '14px',
            fill: '#ffffff',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);

        // Score
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '24px',
            fill: '#00ff00',
            fontFamily: 'Courier New',
            stroke: '#000000',
            strokeThickness: 3
        });

        // Setup collision
        this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);

        // Start spawning (faster for time attack)
        this.startTime = this.time.now;
        this.spawnTimer = this.time.addEvent({
            delay: 1000,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });
    }

    spawnEnemy() {
        const x = randomInt(50, 750);
        const number = randomInt(2, 100);
        const enemy = new EnemyShip(this, x, -30, number, 120);
        this.enemies.add(enemy);
    }

    hitEnemy(bullet, enemy) {
        if (!bullet.active || !enemy.active) return;

        bullet.setActive(false);
        enemy.setActive(false);

        const isPrimeNumber = enemy.checkIsPrime();
        const enemyX = enemy.x;
        const enemyY = enemy.y;

        if (isPrimeNumber) {
            // Add time bonus
            this.timeRemaining += CONFIG.TIME_ATTACK_BONUS_PER_CORRECT;
            this.score += 10;
            this.correctHits++;
            this.showFloatingText(enemyX, enemyY, '+0.5s', '#00ff00');
        } else {
            // Time penalty
            this.timeRemaining -= CONFIG.TIME_ATTACK_PENALTY_PER_WRONG;
            this.score = Math.max(0, this.score - 5);
            this.wrongHits++;
            this.showFloatingText(enemyX, enemyY, '-2s', '#ff0000');
            this.cameras.main.shake(200, 0.01);
        }

        enemy.destroy();
        this.scoreText.setText(`Score: ${this.score}`);
    }

    showFloatingText(x, y, text, color) {
        const floatText = this.add.text(x, y, text, {
            fontSize: '28px',
            fill: color,
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.tweens.add({
            targets: floatText,
            y: y - 50,
            alpha: 0,
            duration: 800,
            onComplete: () => floatText.destroy()
        });
    }

    formatTime(ms) {
        const seconds = Math.max(0, Math.ceil(ms / 1000));
        return `${seconds}s`;
    }

    gameOver() {
        if (this.spawnTimer) {
            this.spawnTimer.remove();
        }

        const leaderboardManager = new LeaderboardManager();
        if (leaderboardManager.isHighScore('time_attack', this.score)) {
            const name = prompt('New High Score! Enter your name:') || 'Player';
            leaderboardManager.addScore('time_attack', name, this.score, {
                correctHits: this.correctHits,
                wrongHits: this.wrongHits
            });
        }

        this.scene.start('GameOverScene', {
            score: this.score,
            mode: 'time_attack',
            correctHits: this.correctHits,
            wrongHits: this.wrongHits,
            shotsFired: this.correctHits + this.wrongHits,
            wave: 0
        });
    }

    update(time) {
        // Update timer
        const elapsed = time - this.startTime;
        this.timeRemaining = CONFIG.TIME_ATTACK_DURATION - elapsed +
            (this.correctHits * CONFIG.TIME_ATTACK_BONUS_PER_CORRECT) -
            (this.wrongHits * CONFIG.TIME_ATTACK_PENALTY_PER_WRONG);

        if (this.timeRemaining <= 0) {
            this.timeRemaining = 0;
            this.gameOver();
            return;
        }

        // Update timer display
        this.timerText.setText(this.formatTime(this.timeRemaining));

        // Update timer bar
        const timePercent = Math.min(1, this.timeRemaining / CONFIG.TIME_ATTACK_DURATION);
        this.timerBar.setScale(timePercent, 1);

        // Color based on time
        if (timePercent > 0.5) {
            this.timerBar.setFillStyle(0x00ff00);
        } else if (timePercent > 0.25) {
            this.timerBar.setFillStyle(0xffff00);
        } else {
            this.timerBar.setFillStyle(0xff0000);
        }

        // Update starfield
        this.stars.forEach(star => {
            star.y += star.speed;
            if (star.y > 600) {
                star.y = 0;
                star.x = Phaser.Math.Between(0, 800);
            }
        });

        // Update player
        this.player.update(this.cursors, this.wasd);

        // Shooting
        if (this.spaceKey.isDown && this.player.shoot(time)) {
            const bullet = new Bullet(this, this.player.x, this.player.y - 20);
            this.bullets.add(bullet);
        }

        // Update enemies
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.active) {
                enemy.update();
                if (enemy.y > 620) {
                    enemy.destroy();
                }
            }
        });

        // Clean up bullets
        this.bullets.getChildren().forEach(bullet => {
            if (bullet.y < -10) {
                bullet.destroy();
            }
        });
    }
}
