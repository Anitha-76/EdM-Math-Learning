import { CONFIG } from '../utils/GameConfig.js';
import { randomInt } from '../utils/MathHelpers.js';
import Player from '../entities/Player.js';
import EnemyShip from '../entities/EnemyShip.js';
import Bullet from '../entities/Bullet.js';
import LeaderboardManager from '../utils/LeaderboardManager.js';

export default class EndlessScene extends Phaser.Scene {
    constructor() {
        super('EndlessScene');
    }

    init() {
        this.score = 0;
        this.lives = CONFIG.ENDLESS_LIVES;
        this.wave = 1;
        this.correctHitsTotal = 0;
        this.wrongHits = 0;
        this.baseEnemySpeed = 80;
        this.baseSpawnRate = 2000;
        this.gameMode = 'endless';
    }

    create() {
        // Create starfield
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

        // UI
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '24px',
            fill: '#00ff00',
            fontFamily: 'Courier New',
            stroke: '#000000',
            strokeThickness: 3
        });

        this.waveText = this.add.text(400, 16, 'Wave: 1', {
            fontSize: '28px',
            fill: '#ff00ff',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5, 0);

        this.livesText = this.add.text(784, 16, `Lives: ${'❤️'.repeat(this.lives)}`, {
            fontSize: '20px',
            fill: '#ff0066',
            fontFamily: 'Courier New',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(1, 0);

        this.nextLifeText = this.add.text(400, 580,
            `Next life in: ${CONFIG.ENDLESS_LIFE_RESTORE_INTERVAL} hits`, {
            fontSize: '14px',
            fill: '#00ff00',
            fontFamily: 'Courier New'
        }).setOrigin(0.5, 1);

        // Setup collision
        this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);

        // Start spawning
        this.startSpawning();
    }

    startSpawning() {
        const diffMultiplier = 1 + (this.wave - 1) * CONFIG.ENDLESS_DIFFICULTY_RAMP;
        const spawnRate = Math.max(800, this.baseSpawnRate / diffMultiplier);

        this.spawnTimer = this.time.addEvent({
            delay: spawnRate,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });
    }

    spawnEnemy() {
        const x = randomInt(50, 750);
        const rangeMax = Math.min(30 + this.wave * 10, 200);
        const number = randomInt(2, rangeMax);
        const diffMultiplier = 1 + (this.wave - 1) * CONFIG.ENDLESS_DIFFICULTY_RAMP;
        const speed = this.baseEnemySpeed * diffMultiplier;

        const enemy = new EnemyShip(this, x, -30, number, speed);
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
            this.correctHitsTotal++;
            this.score += 10;
            this.showFloatingText(enemyX, enemyY, '+10', '#00ff00');

            // Life restore check
            if (this.correctHitsTotal % CONFIG.ENDLESS_LIFE_RESTORE_INTERVAL === 0) {
                this.restoreLife();
            }

            // Wave progression (every 20 hits)
            if (this.correctHitsTotal % 20 === 0) {
                this.nextWave();
            }
        } else {
            this.wrongHits++;
            this.score = Math.max(0, this.score - 5);
            this.showFloatingText(enemyX, enemyY, '-5', '#ff0000');
            this.loseLife();
        }

        enemy.destroy();
        this.updateUI();
    }

    loseLife() {
        this.lives--;
        this.cameras.main.shake(200, 0.01);

        if (this.lives <= 0) {
            this.gameOver();
        }
    }

    restoreLife() {
        if (this.lives < 5) {
            this.lives++;
            this.showMessage('❤️ LIFE RESTORED! ❤️', '#ff0066');
        }
    }

    nextWave() {
        this.wave++;
        this.waveText.setText(`Wave: ${this.wave}`);
        this.showMessage(`WAVE ${this.wave}`, '#ff00ff');

        // Restart spawning with new difficulty
        if (this.spawnTimer) {
            this.spawnTimer.remove();
        }
        this.startSpawning();
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

    showMessage(text, color) {
        const msg = this.add.text(400, 300, text, {
            fontSize: '36px',
            fill: color,
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.tweens.add({
            targets: msg,
            alpha: 0,
            scale: 1.5,
            duration: 2000,
            onComplete: () => msg.destroy()
        });
    }

    updateUI() {
        this.scoreText.setText(`Score: ${this.score}`);
        this.livesText.setText(`Lives: ${'❤️'.repeat(Math.max(0, this.lives))}`);

        const hitsUntilLife = CONFIG.ENDLESS_LIFE_RESTORE_INTERVAL -
            (this.correctHitsTotal % CONFIG.ENDLESS_LIFE_RESTORE_INTERVAL);
        this.nextLifeText.setText(`Next life in: ${hitsUntilLife} hits`);
    }

    gameOver() {
        if (this.spawnTimer) {
            this.spawnTimer.remove();
        }

        const leaderboardManager = new LeaderboardManager();
        if (leaderboardManager.isHighScore('endless', this.score)) {
            const name = prompt('New High Score! Enter your name:') || 'Player';
            leaderboardManager.addScore('endless', name, this.score, {
                waves: this.wave,
                correctHits: this.correctHitsTotal
            });
        }

        this.scene.start('GameOverScene', {
            score: this.score,
            mode: 'endless',
            wave: this.wave,
            correctHits: this.correctHitsTotal,
            wrongHits: this.wrongHits,
            shotsFired: this.correctHitsTotal + this.wrongHits
        });
    }

    update(time) {
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
                    // Missed enemy
                    if (enemy.checkIsPrime()) {
                        this.loseLife();
                        this.updateUI();
                    }
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
