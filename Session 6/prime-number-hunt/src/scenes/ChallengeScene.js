import { TWIN_PRIMES, MERSENNE_PRIMES, FIBONACCI_PRIMES } from '../utils/GameConfig.js';
import { randomInt, isPrime } from '../utils/MathHelpers.js';
import Player from '../entities/Player.js';
import EnemyShip from '../entities/EnemyShip.js';
import Bullet from '../entities/Bullet.js';
import LeaderboardManager from '../utils/LeaderboardManager.js';

export default class ChallengeScene extends Phaser.Scene {
    constructor() {
        super('ChallengeScene');
    }

    create() {
        this.showCategorySelection();
    }

    showCategorySelection() {
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

        this.add.text(400, 50, 'SELECT CHALLENGE', {
            fontSize: '40px',
            fill: '#ffaa00',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        const challenges = [
            {
                category: 'twin_primes',
                name: 'Twin Primes',
                icon: '👥',
                description: 'Find pairs that differ by 2',
                primes: TWIN_PRIMES.flat()
            },
            {
                category: 'mersenne_primes',
                name: 'Mersenne Primes',
                icon: '🔬',
                description: 'Primes of form 2^n - 1',
                primes: MERSENNE_PRIMES
            },
            {
                category: 'small_primes',
                name: 'Small Primes',
                icon: '🔢',
                description: 'Master primes under 20',
                primes: [2, 3, 5, 7, 11, 13, 17, 19]
            },
            {
                category: 'large_primes',
                name: 'Large Primes',
                icon: '💯',
                description: 'Primes from 100-200',
                primes: this.getPrimesInRange(100, 200)
            },
            {
                category: 'fibonacci_primes',
                name: 'Fibonacci Primes',
                icon: '🌀',
                description: 'Primes in Fibonacci sequence',
                primes: FIBONACCI_PRIMES
            }
        ];

        let yPos = 140;
        challenges.forEach(challenge => {
            this.createChallengeCard(challenge, yPos);
            yPos += 85;
        });

        const backBtn = this.add.text(400, 560, 'BACK', {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Courier New',
            backgroundColor: '#333333',
            padding: { x: 20, y: 8 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        backBtn.on('pointerover', () => backBtn.setScale(1.1));
        backBtn.on('pointerout', () => backBtn.setScale(1));
        backBtn.on('pointerdown', () => {
            this.scene.start('ModeSelectScene');
        });
    }

    createChallengeCard(challenge, y) {
        const card = this.add.rectangle(400, y, 700, 70, 0xaa6600, 0.3)
            .setStrokeStyle(2, 0xffaa00)
            .setInteractive({ useHandCursor: true });

        this.add.text(120, y, challenge.icon, {
            fontSize: '36px'
        }).setOrigin(0.5);

        this.add.text(180, y - 12, challenge.name, {
            fontSize: '22px',
            fill: '#ffffff',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);

        this.add.text(180, y + 12, challenge.description, {
            fontSize: '12px',
            fill: '#cccccc',
            fontFamily: 'Courier New'
        }).setOrigin(0, 0.5);

        card.on('pointerover', () => {
            card.setFillStyle(0xaa6600, 0.6);
            card.setScale(1.02);
        });

        card.on('pointerout', () => {
            card.setFillStyle(0xaa6600, 0.3);
            card.setScale(1);
        });

        card.on('pointerdown', () => {
            this.startChallenge(challenge);
        });
    }

    startChallenge(challenge) {
        // Clear scene
        this.children.removeAll();

        this.gameMode = `challenge_${challenge.category}`;
        this.challengeName = challenge.name;
        this.targetPrimes = [...challenge.primes];
        this.foundPrimes = [];
        this.score = 0;
        this.lives = 3;
        this.wrongHits = 0;

        this.initializeChallengeGame();
    }

    initializeChallengeGame() {
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
        this.enemies = this.add.group({ classType: EnemyShip, maxSize: 10 });

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
        this.add.text(400, 20, `CHALLENGE: ${this.challengeName}`, {
            fontSize: '24px',
            fill: '#ffaa00',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.progressText = this.add.text(400, 50,
            `Found: 0 / ${this.targetPrimes.length}`, {
            fontSize: '18px',
            fill: '#ffffff',
            fontFamily: 'Courier New',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '20px',
            fill: '#00ff00',
            fontFamily: 'Courier New',
            stroke: '#000000',
            strokeThickness: 2
        });

        this.livesText = this.add.text(784, 16, `Lives: ${'❤️'.repeat(this.lives)}`, {
            fontSize: '20px',
            fill: '#ff0066',
            fontFamily: 'Courier New',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(1, 0);

        // Setup collision
        this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);

        // Start spawning
        this.spawnTimer = this.time.addEvent({
            delay: 2000,
            callback: this.spawnChallengeEnemy,
            callbackScope: this,
            loop: true
        });

        this.isPlaying = true;
    }

    spawnChallengeEnemy() {
        if (!this.isPlaying) return;

        let number;
        // 70% chance spawn target prime, 30% composite
        if (Math.random() < 0.7 && this.targetPrimes.length > 0) {
            number = Phaser.Utils.Array.GetRandom(this.targetPrimes);
        } else {
            const range = this.getNumberRange();
            number = randomInt(range.min, range.max);
            // Ensure composite
            while (isPrime(number)) {
                number = randomInt(range.min, range.max);
            }
        }

        const x = randomInt(50, 750);
        const enemy = new EnemyShip(this, x, -30, number, 80);
        this.enemies.add(enemy);
    }

    hitEnemy(bullet, enemy) {
        if (!bullet.active || !enemy.active) return;

        bullet.setActive(false);
        enemy.setActive(false);

        const enemyNumber = enemy.getNumber();
        const isPrimeTarget = this.targetPrimes.includes(enemyNumber);

        if (isPrimeTarget) {
            if (!this.foundPrimes.includes(enemyNumber)) {
                this.foundPrimes.push(enemyNumber);
            }
            this.score += 20;
            this.showFloatingText(enemy.x, enemy.y, '+20', '#00ff00');

            // Check completion
            if (this.foundPrimes.length >= this.targetPrimes.length) {
                this.challengeComplete();
            }
        } else {
            this.lives--;
            this.score = Math.max(0, this.score - 5);
            this.wrongHits++;
            this.showFloatingText(enemy.x, enemy.y, '-5', '#ff0000');
            this.cameras.main.shake(200, 0.01);

            if (this.lives <= 0) {
                this.gameOver(false);
            }
        }

        enemy.destroy();
        this.updateUI();
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

    updateUI() {
        this.progressText.setText(`Found: ${this.foundPrimes.length} / ${this.targetPrimes.length}`);
        this.scoreText.setText(`Score: ${this.score}`);
        this.livesText.setText(`Lives: ${'❤️'.repeat(Math.max(0, this.lives))}`);
    }

    challengeComplete() {
        this.isPlaying = false;
        if (this.spawnTimer) {
            this.spawnTimer.remove();
        }

        // Bonus for remaining lives
        const bonus = this.lives * 100;
        this.score += bonus;

        const msg = this.add.text(400, 300, `CHALLENGE COMPLETE!\nBonus: +${bonus}`, {
            fontSize: '32px',
            fill: '#ffaa00',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);

        this.time.delayedCall(3000, () => {
            this.gameOver(true);
        });
    }

    gameOver(completed) {
        this.isPlaying = false;
        if (this.spawnTimer) {
            this.spawnTimer.remove();
        }

        const leaderboardManager = new LeaderboardManager();
        if (leaderboardManager.isHighScore(this.gameMode, this.score)) {
            const name = prompt('New High Score! Enter your name:') || 'Player';
            leaderboardManager.addScore(this.gameMode, name, this.score);
        }

        this.scene.start('GameOverScene', {
            score: this.score,
            mode: this.gameMode,
            completed: completed,
            correctHits: this.foundPrimes.length,
            wrongHits: this.wrongHits,
            shotsFired: this.foundPrimes.length + this.wrongHits,
            wave: 0
        });
    }

    getNumberRange() {
        if (this.targetPrimes.length === 0) return { min: 2, max: 100 };
        const min = Math.max(2, Math.min(...this.targetPrimes) - 10);
        const max = Math.max(...this.targetPrimes) + 10;
        return { min, max };
    }

    getPrimesInRange(min, max) {
        const primes = [];
        for (let n = min; n <= max; n++) {
            if (isPrime(n)) {
                primes.push(n);
            }
        }
        return primes;
    }

    update(time) {
        if (!this.isPlaying) return;

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
