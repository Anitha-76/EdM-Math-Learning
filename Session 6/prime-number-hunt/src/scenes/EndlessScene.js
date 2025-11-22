import { CONFIG, POWERUP_TYPES } from '../utils/GameConfig.js';
import { randomInt } from '../utils/MathHelpers.js';
// import Player from '../entities/Player.js'; // Not using Player class for 2-player mode
import EnemyShip from '../entities/EnemyShip.js';
import Bullet from '../entities/Bullet.js';
import PowerUp from '../entities/PowerUp.js';
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
        this.baseEnemySpeed = 100; // Increased from 80 for faster action
        this.baseSpawnRate = 1200; // Reduced from 2000 for more frequent enemies
        this.gameMode = 'endless';

        // Power-up system
        this.powerUpSpawnCounter = 0;
        this.powerUpSpawnThreshold = 10; // Reduced from 15 - spawn power-ups more frequently

        // Debuff system
        this.visionReduced = false;
        this.playerSlowed = false;
        this.debuffOverlay = null;

        // 2-Player system
        this.player1Score = 0;
        this.player2Score = 0;
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

        // Create Player 1 (cyan tank - left side)
        this.player1 = this.add.sprite(250, 540, 'player1');
        this.physics.add.existing(this.player1);
        this.player1.body.setCollideWorldBounds(true);
        this.player1.body.setSize(34, 40);
        this.player1.setDepth(10);
        this.player1.speed = CONFIG.PLAYER_SPEED;
        this.player1.fireRate = CONFIG.PLAYER_FIRE_RATE;
        this.player1.lastFired = 0;

        // Create Player 2 (magenta tank - right side)
        this.player2 = this.add.sprite(550, 540, 'player2');
        this.physics.add.existing(this.player2);
        this.player2.body.setCollideWorldBounds(true);
        this.player2.body.setSize(34, 40);
        this.player2.setDepth(10);
        this.player2.speed = CONFIG.PLAYER_SPEED;
        this.player2.fireRate = CONFIG.PLAYER_FIRE_RATE;
        this.player2.lastFired = 0;

        // Create groups
        this.bullets1 = this.add.group({ classType: Bullet, maxSize: 30 });
        this.bullets2 = this.add.group({ classType: Bullet, maxSize: 30 });
        this.enemies = this.add.group({ classType: EnemyShip, maxSize: 15 });
        this.powerUps = this.add.group({ classType: PowerUp, maxSize: 5 });

        // Setup input for Player 1 (WASD + Left Shift)
        this.wasd = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };
        this.player1ShootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // Setup input for Player 2 (Arrow Keys + Right Shift or Enter)
        this.cursors = this.input.keyboard.createCursorKeys();
        this.player2ShootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.input.keyboard.addCapture([
            Phaser.Input.Keyboard.KeyCodes.SHIFT,
            Phaser.Input.Keyboard.KeyCodes.ENTER
        ]);

        // UI - Player 1 Score (left side, cyan)
        this.player1ScoreText = this.add.text(16, 16, 'P1: 0', {
            fontSize: '20px',
            fill: '#00ffff',
            fontFamily: 'Courier New',
            stroke: '#000000',
            strokeThickness: 3
        });

        // UI - Player 2 Score (left side below P1, magenta)
        this.player2ScoreText = this.add.text(16, 44, 'P2: 0', {
            fontSize: '20px',
            fill: '#ff00ff',
            fontFamily: 'Courier New',
            stroke: '#000000',
            strokeThickness: 3
        });

        // UI - Total Score
        this.scoreText = this.add.text(16, 72, 'Total: 0', {
            fontSize: '20px',
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

        // Controls instruction (right side)
        this.add.text(784, 16, 'P1: WASD + Shift', {
            fontSize: '14px',
            fill: '#00ffff',
            fontFamily: 'Courier New',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(1, 0);

        this.add.text(784, 36, 'P2: Arrows + Enter', {
            fontSize: '14px',
            fill: '#ff00ff',
            fontFamily: 'Courier New',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(1, 0);

        // Setup collision
        this.physics.add.overlap(this.bullets1, this.enemies, (bullet, enemy) => this.hitEnemy(bullet, enemy, 1), null, this);
        this.physics.add.overlap(this.bullets2, this.enemies, (bullet, enemy) => this.hitEnemy(bullet, enemy, 2), null, this);
        // Power-up collection disabled for now
        // this.physics.add.overlap(this.player1, this.powerUps, this.collectPowerUp, null, this);
        // this.physics.add.overlap(this.player2, this.powerUps, this.collectPowerUp, null, this);

        // Start spawning
        this.startSpawning();
    }

    startSpawning() {
        const diffMultiplier = 1 + (this.wave - 1) * CONFIG.ENDLESS_DIFFICULTY_RAMP;
        const spawnRate = Math.max(500, this.baseSpawnRate / diffMultiplier); // Reduced minimum from 800 to 500

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

    hitEnemy(bullet, enemy, playerNum) {
        if (!bullet.active || !enemy.active) return;

        bullet.setActive(false);
        enemy.setActive(false);

        const isPrimeNumber = enemy.checkIsPrime();
        const enemyX = enemy.x;
        const enemyY = enemy.y;

        if (isPrimeNumber) {
            this.correctHitsTotal++;
            this.powerUpSpawnCounter++;

            // Calculate score (power-up system disabled for now since players are simple sprites)
            let points = 10;

            // Add to individual player score
            if (playerNum === 1) {
                this.player1Score += points;
                this.showFloatingText(enemyX, enemyY, `P1 +${points}`, '#00ffff');
            } else {
                this.player2Score += points;
                this.showFloatingText(enemyX, enemyY, `P2 +${points}`, '#ff00ff');
            }

            // Add to total score
            this.score += points;

            // Power-up spawning (disabled for now - will re-enable after fixing 2-player display)
            // if (this.powerUpSpawnCounter >= this.powerUpSpawnThreshold) {
            //     this.spawnPowerUp();
            //     this.powerUpSpawnCounter = 0;
            // }

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

        // Apply debuffs based on wave
        this.applyDebuffs();

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
        this.player1ScoreText.setText(`P1: ${this.player1Score}`);
        this.player2ScoreText.setText(`P2: ${this.player2Score}`);
        this.scoreText.setText(`Total: ${this.score}`);
        this.livesText.setText(`Lives: ${'❤️'.repeat(Math.max(0, this.lives))}`);

        const hitsUntilLife = CONFIG.ENDLESS_LIFE_RESTORE_INTERVAL -
            (this.correctHitsTotal % CONFIG.ENDLESS_LIFE_RESTORE_INTERVAL);
        this.nextLifeText.setText(`Next life in: ${hitsUntilLife} hits`);
    }

    spawnPowerUp() {
        const powerUpTypes = Object.keys(POWERUP_TYPES);
        const randomType = powerUpTypes[randomInt(0, powerUpTypes.length - 1)];
        const x = randomInt(100, 700);

        const powerUp = new PowerUp(this, x, -30, randomType);
        this.powerUps.add(powerUp);

        this.showMessage('Power-Up!', '#ffff00');
    }

    collectPowerUp(player, powerUp) {
        if (!powerUp.active) return;

        powerUp.activate(player);
    }

    showPowerUpNotification(text) {
        const notification = this.add.text(400, 100, text, {
            fontSize: '32px',
            fill: '#ffff00',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.tweens.add({
            targets: notification,
            y: 80,
            alpha: 0,
            duration: 2000,
            onComplete: () => notification.destroy()
        });
    }

    applyDebuffs() {
        // Apply vision reduction at wave 5+
        if (this.wave >= 5 && !this.visionReduced) {
            this.visionReduced = true;
            this.createVisionOverlay();
        }

        // Apply speed reduction at wave 8+
        if (this.wave >= 8 && !this.playerSlowed) {
            this.playerSlowed = true;
            this.player1.speed = CONFIG.PLAYER_SPEED * 0.7;
            this.player2.speed = CONFIG.PLAYER_SPEED * 0.7;
            this.showMessage('Speed Reduced!', '#ff6600');
        }

        // Increase darkness at wave 10+
        if (this.wave >= 10 && this.debuffOverlay) {
            this.debuffOverlay.setAlpha(Math.min(0.7, 0.3 + (this.wave - 10) * 0.05));
        }
    }

    createVisionOverlay() {
        // Create a dark overlay that reduces vision
        this.debuffOverlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.3);
        this.debuffOverlay.setDepth(5);

        // Create spotlight effects around both players
        const spotlight1 = this.add.circle(this.player1.x, this.player1.y, 120, 0x000000, 0);
        spotlight1.setDepth(6);

        const spotlight2 = this.add.circle(this.player2.x, this.player2.y, 120, 0x000000, 0);
        spotlight2.setDepth(6);

        this.player1Spotlight = spotlight1;
        this.player2Spotlight = spotlight2;

        this.showMessage('Vision Reduced!', '#ff0000');
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

        // Update spotlight positions if vision is reduced
        if (this.visionReduced) {
            if (this.player1Spotlight) {
                this.player1Spotlight.setPosition(this.player1.x, this.player1.y);
            }
            if (this.player2Spotlight) {
                this.player2Spotlight.setPosition(this.player2.x, this.player2.y);
            }
        }

        // Update Player 1 (WASD keys)
        this.player1.body.setVelocity(0);
        if (this.wasd.left.isDown) {
            this.player1.body.setVelocityX(-this.player1.speed);
        } else if (this.wasd.right.isDown) {
            this.player1.body.setVelocityX(this.player1.speed);
        }
        if (this.wasd.up.isDown) {
            this.player1.body.setVelocityY(-this.player1.speed);
        } else if (this.wasd.down.isDown) {
            this.player1.body.setVelocityY(this.player1.speed);
        }

        // Player 1 Shooting
        if (this.player1ShootKey.isDown && time > this.player1.lastFired) {
            this.player1.lastFired = time + this.player1.fireRate;
            const bullet = new Bullet(this, this.player1.x, this.player1.y - 20);
            bullet.setTint(0x00ffff);
            this.bullets1.add(bullet);
        }

        // Update Player 2 (Arrow keys)
        this.player2.body.setVelocity(0);
        if (this.cursors.left.isDown) {
            this.player2.body.setVelocityX(-this.player2.speed);
        } else if (this.cursors.right.isDown) {
            this.player2.body.setVelocityX(this.player2.speed);
        }
        if (this.cursors.up.isDown) {
            this.player2.body.setVelocityY(-this.player2.speed);
        } else if (this.cursors.down.isDown) {
            this.player2.body.setVelocityY(this.player2.speed);
        }

        // Player 2 Shooting
        if (this.player2ShootKey.isDown && time > this.player2.lastFired) {
            this.player2.lastFired = time + this.player2.fireRate;
            const bullet = new Bullet(this, this.player2.x, this.player2.y - 20);
            bullet.setTint(0xff00ff);
            this.bullets2.add(bullet);
        }

        // Update power-ups
        this.powerUps.getChildren().forEach(powerUp => {
            if (powerUp.active) {
                powerUp.update();
            }
        });

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

        // Clean up bullets for both players
        this.bullets1.getChildren().forEach(bullet => {
            if (bullet.y < -10) {
                bullet.destroy();
            }
        });
        this.bullets2.getChildren().forEach(bullet => {
            if (bullet.y < -10) {
                bullet.destroy();
            }
        });
    }
}
