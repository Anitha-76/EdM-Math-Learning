import { CONFIG } from '../utils/GameConfig.js';
import { randomInt } from '../utils/MathHelpers.js';
import Player from '../entities/Player.js';
import EnemyShip from '../entities/EnemyShip.js';
import Bullet from '../entities/Bullet.js';
import PowerUp from '../entities/PowerUp.js';
import WaveManager from '../utils/WaveManager.js';
import PowerUpManager from '../utils/PowerUpManager.js';
import StatsTracker from '../utils/StatsTracker.js';
import HintSystem from '../utils/HintSystem.js';
import AchievementManager from '../utils/AchievementManager.js';
import SoundManager from '../utils/SoundManager.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init() {
        // Reset game state
        this.score = 0;
        this.shotsFired = 0;
        this.correctHits = 0;
        this.wrongHits = 0;
        this.comboCount = 0;
        this.lastHitTime = 0;

        // Initialize stats tracker
        this.statsTracker = new StatsTracker();
        this.statsTracker.startGame();
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
        this.bullets = this.add.group({
            classType: Bullet,
            maxSize: 30
        });

        this.enemies = this.add.group({
            classType: EnemyShip,
            maxSize: 10
        });

        this.powerUps = this.add.group({
            classType: PowerUp,
            maxSize: 5
        });

        // Initialize managers
        this.waveManager = new WaveManager(this);
        this.powerUpManager = new PowerUpManager(this);
        this.powerUpManager.setGroup(this.powerUps);

        // Initialize hint system and achievement manager
        this.hintSystem = new HintSystem(this);
        this.achievementManager = new AchievementManager(this);

        // Initialize sound manager and start music
        this.soundManager = new SoundManager(this);
        this.soundManager.startMusic();

        // Setup input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // Prevent spacebar from scrolling the page
        this.input.keyboard.addCapture(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Create UI
        this.createUI();

        // Setup collision detection
        this.physics.add.overlap(
            this.bullets,
            this.enemies,
            this.hitEnemy,
            null,
            this
        );

        this.physics.add.overlap(
            this.player,
            this.powerUps,
            this.collectPowerUp,
            null,
            this
        );

        // Start first wave
        this.waveManager.startWave();
    }

    createUI() {
        // Score text (top-left)
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Courier New',
            stroke: '#000000',
            strokeThickness: 3
        });

        // Lives text (top-right)
        this.livesText = this.add.text(784, 16, 'Lives: ❤️❤️❤️', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Courier New',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(1, 0);

        // Wave text (top-center)
        this.waveText = this.add.text(400, 16, 'Wave: 1', {
            fontSize: '24px',
            fill: '#00ffff',
            fontFamily: 'Courier New',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5, 0);

        // Combo text (bottom-center)
        this.comboText = this.add.text(400, 560, '', {
            fontSize: '32px',
            fill: '#ffff00',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5, 1).setAlpha(0);

        // Fibonacci progress text (bottom-left)
        this.fibProgressText = this.add.text(16, 580, 'Next Power-up: 10 pts', {
            fontSize: '14px',
            fill: '#ff00ff',
            fontFamily: 'Courier New',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0, 1);

        // Pause hint
        this.add.text(784, 580, 'ESC: Pause', {
            fontSize: '12px',
            fill: '#888888',
            fontFamily: 'Courier New'
        }).setOrigin(1, 1);

        // Hint key indicator
        this.hintIndicator = this.add.text(400, 580, 'H: Hint (3)', {
            fontSize: '12px',
            fill: '#00ffff',
            fontFamily: 'Courier New'
        }).setOrigin(0.5, 1);
    }

    spawnEnemy() {
        // Check if wave manager allows spawning
        if (!this.waveManager.canSpawnEnemy()) {
            return;
        }

        // Check if we've reached max simultaneous enemies
        const difficulty = this.waveManager.getCurrentDifficulty();
        const activeEnemies = this.enemies.getChildren().filter(e => e.active).length;
        if (activeEnemies >= difficulty.simultaneousEnemies) {
            return;
        }

        // Random position at top of screen
        const x = randomInt(50, 750);
        const y = -30;

        // Random number from range based on difficulty
        const number = randomInt(CONFIG.NUMBER_RANGE_MIN, difficulty.numberRangeMax);

        // Create enemy with current difficulty speed
        const enemy = new EnemyShip(this, x, y, number, difficulty.enemySpeed);
        this.enemies.add(enemy);

        // Notify wave manager
        this.waveManager.enemySpawned();
    }

    hitEnemy(bullet, enemy) {
        // Guard against multiple collision calls
        if (!bullet.active || !enemy.active) {
            return;
        }

        // Deactivate immediately
        bullet.setActive(false);
        enemy.setActive(false);

        const isPrime = enemy.checkIsPrime();
        const enemyNumber = enemy.getNumber();
        const enemyX = enemy.x;
        const enemyY = enemy.y;
        const currentTime = this.time.now;

        // Record hit in stats
        this.statsTracker.recordHit(enemyNumber, isPrime);

        if (isPrime) {
            // Correct hit - prime number
            this.soundManager.playCorrectHit();
            let points = CONFIG.SCORE_CORRECT_HIT;

            // Apply score multiplier if active
            if (this.player.scoreMultiplierActive) {
                points *= 2;
                this.showFloatingText(enemyX, enemyY, `+${points} (2x)`, '#ffff00');
            } else {
                this.showFloatingText(enemyX, enemyY, `+${points}`, '#00ff00');
            }

            this.score += points;
            this.correctHits++;

            // Combo system
            if (currentTime - this.lastHitTime < CONFIG.COMBO_TIMEOUT) {
                this.comboCount++;
                this.statsTracker.recordCombo(this.comboCount);
                if (this.comboCount >= CONFIG.COMBO_THRESHOLD) {
                    this.showCombo();
                }
            } else {
                this.comboCount = 1;
            }
            this.lastHitTime = currentTime;

            // Check for power-up spawn
            this.powerUpManager.checkForPowerUpSpawn(this.score);

            // Check achievements during gameplay
            this.achievementManager.checkAchievements(
                this.statsTracker,
                this.waveManager.currentWave,
                this.player.getLives()
            );

        } else {
            // Wrong hit - composite number
            this.soundManager.playWrongHit();
            this.showFloatingText(enemyX, enemyY, '-5', '#ff0000');
            this.score += CONFIG.SCORE_WRONG_HIT;
            this.wrongHits++;
            this.comboCount = 0; // Break combo

            // Show educational feedback
            this.hintSystem.showWrongHitFeedback(enemyNumber);

            const livesRemaining = this.player.takeDamage();
            this.updateLivesDisplay();

            // Screen shake
            this.cameras.main.shake(CONFIG.SCREEN_SHAKE_DURATION, 0.01);

            // Check for game over
            if (livesRemaining <= 0) {
                this.gameOver();
                return;
            }
        }

        // Destroy enemy
        enemy.destroy();

        // Notify wave manager
        this.waveManager.enemyDestroyed();

        // Update score display
        this.updateScoreDisplay();
    }

    collectPowerUp(player, powerUp) {
        powerUp.activate(player);
        this.statsTracker.recordPowerUpCollected();
        this.soundManager.playPowerUp();
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

    showCombo() {
        const bonusPoints = this.comboCount * 5;
        this.score += bonusPoints;

        this.soundManager.playCombo();
        this.comboText.setText(`COMBO x${this.comboCount}! +${bonusPoints}`);
        this.comboText.setAlpha(1);

        this.tweens.add({
            targets: this.comboText,
            scale: 1.3,
            duration: 200,
            yoyo: true,
            onComplete: () => {
                this.tweens.add({
                    targets: this.comboText,
                    alpha: 0,
                    duration: 1000,
                    delay: 500
                });
            }
        });
    }

    showPowerUpNotification(text) {
        const notification = this.add.text(400, 150, text, {
            fontSize: '28px',
            fill: '#ff00ff',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.tweens.add({
            targets: notification,
            alpha: 0,
            y: 100,
            duration: 2000,
            onComplete: () => notification.destroy()
        });
    }

    updateScoreDisplay() {
        this.scoreText.setText(`Score: ${this.score}`);

        // Pulse effect
        this.tweens.add({
            targets: this.scoreText,
            scale: 1.2,
            duration: 100,
            yoyo: true
        });
    }

    updateLivesDisplay() {
        const lives = this.player.getLives();
        const hearts = '❤️'.repeat(Math.max(0, lives));
        this.livesText.setText(`Lives: ${hearts}`);
    }

    updateFibProgressDisplay() {
        const info = this.powerUpManager.getNextPowerUpInfo();
        const pointsNeeded = info.pointsNeeded - this.score;
        if (pointsNeeded > 0) {
            this.fibProgressText.setText(`Next Power-up: ${pointsNeeded} pts`);
        } else {
            this.fibProgressText.setText('Power-up ready!');
        }
    }

    checkMissedPrimes() {
        const enemiesToDestroy = [];

        this.enemies.getChildren().forEach(enemy => {
            if (enemy.active && enemy.y > 620) {
                enemiesToDestroy.push(enemy);
            }
        });

        enemiesToDestroy.forEach(enemy => {
            if (enemy.checkIsPrime()) {
                // Missed a prime - lose a life
                const missedNumber = enemy.getNumber();
                this.statsTracker.recordMissedPrime(missedNumber);

                const livesRemaining = this.player.takeDamage();
                this.updateLivesDisplay();

                // Show educational feedback
                this.hintSystem.showMissedPrimeFeedback(missedNumber);

                // Check for game over
                if (livesRemaining <= 0) {
                    this.gameOver();
                }
            }
            // Destroy escaped enemy
            enemy.destroy();
            this.waveManager.enemyDestroyed();
        });
    }

    showWarning(message) {
        const warning = this.add.text(400, 300, message, {
            fontSize: '36px',
            fill: '#ff6600',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.tweens.add({
            targets: warning,
            alpha: 0,
            scale: 1.5,
            duration: 1000,
            onComplete: () => warning.destroy()
        });
    }

    updateHintIndicator() {
        const hintsRemaining = this.hintSystem.getHintsRemaining();
        this.hintIndicator.setText(`H: Hint (${hintsRemaining})`);
        if (hintsRemaining === 0) {
            this.hintIndicator.setFill('#666666');
        }
    }

    gameOver() {
        // Stop spawning
        if (this.enemySpawnTimer) {
            this.enemySpawnTimer.remove();
        }

        // Stop music and play game over sound
        this.soundManager.stopMusic();
        this.soundManager.playGameOver();

        // End game stats tracking
        this.statsTracker.endGame(this.score, this.waveManager.currentWave);

        // Check end-game achievements
        this.achievementManager.checkEndGameAchievements(
            this.statsTracker,
            this.waveManager.currentWave,
            this.player.getLives()
        );

        // Get session stats and newly unlocked achievements
        const sessionStats = this.statsTracker.getSessionStats();
        const newAchievements = this.achievementManager.getNewlyUnlocked()
            .map(id => {
                const achievement = this.achievementManager.getAllAchievements()
                    .find(a => a.id === id);
                return achievement;
            })
            .filter(a => a);

        // Pass game data to GameOverScene
        this.scene.start('GameOverScene', {
            score: this.score,
            shotsFired: this.shotsFired,
            correctHits: this.correctHits,
            wrongHits: this.wrongHits,
            wave: this.waveManager.currentWave,
            sessionStats: sessionStats,
            newAchievements: newAchievements
        });
    }

    update(time) {
        // Check for pause
        if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
            this.scene.pause();
            this.scene.launch('PauseScene');
            return;
        }

        // Update starfield
        this.stars.forEach(star => {
            star.y += star.speed;
            if (star.y > 600) {
                star.y = 0;
                star.x = Phaser.Math.Between(0, 800);
            }
        });

        // Update player movement
        this.player.update(this.cursors, this.wasd);

        // Handle shooting
        if (this.spaceKey.isDown && this.player.shoot(time)) {
            const bullet = new Bullet(this, this.player.x, this.player.y - 20);
            this.bullets.add(bullet);
            this.shotsFired++;
            this.statsTracker.recordShot();
            this.soundManager.playShoot();
        }

        // Update hint system
        this.hintSystem.update();
        this.updateHintIndicator();

        // Update enemies (sync number text position)
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.active) {
                enemy.update();
            }
        });

        // Update power-ups
        this.powerUps.getChildren().forEach(powerUp => {
            if (powerUp.active) {
                powerUp.update();
            }
        });

        // Check for missed primes (enemies that escaped)
        this.checkMissedPrimes();

        // Check wave completion
        this.waveManager.checkWaveComplete();

        // Update Fibonacci progress
        this.updateFibProgressDisplay();

        // Clean up off-screen bullets
        const bulletsArray = this.bullets.getChildren();
        for (let i = bulletsArray.length - 1; i >= 0; i--) {
            if (bulletsArray[i].y < -10) {
                bulletsArray[i].destroy();
            }
        }
    }
}
