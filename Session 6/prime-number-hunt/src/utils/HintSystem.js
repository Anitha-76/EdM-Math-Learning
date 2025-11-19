import { CONFIG, PRIME_FACTS } from './GameConfig.js';
import { isPrime, getFactorizationString } from './MathHelpers.js';

export default class HintSystem {
    constructor(scene) {
        this.scene = scene;
        this.hintsRemaining = CONFIG.HINTS_PER_WAVE;
        this.lastHintTime = 0;
        this.hintText = null;
        this.hintKey = null;
        this.currentWave = 1;

        this.setupHintKey();
    }

    setupHintKey() {
        this.hintKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
    }

    resetForWave(waveNumber) {
        this.hintsRemaining = CONFIG.HINTS_PER_WAVE;
        this.currentWave = waveNumber;
    }

    canUseHint() {
        const currentTime = this.scene.time.now;
        return this.hintsRemaining > 0 &&
               (currentTime - this.lastHintTime) > CONFIG.HINT_COOLDOWN;
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.hintKey) && this.canUseHint()) {
            this.showHint();
        }
    }

    showHint() {
        if (!this.canUseHint()) return;

        this.hintsRemaining--;
        this.lastHintTime = this.scene.time.now;

        // Get hint based on current game state
        const hint = this.generateHint();
        this.displayHint(hint);

        // Notify stats tracker
        if (this.scene.statsTracker) {
            this.scene.statsTracker.recordHintUsed();
        }

        return true;
    }

    generateHint() {
        // Get active enemies
        const enemies = this.scene.enemies.getChildren().filter(e => e.active);

        if (enemies.length === 0) {
            // No enemies, show a random prime fact
            return this.getRandomPrimeFact();
        }

        // Find the first prime in the list
        const primeEnemy = enemies.find(e => e.checkIsPrime());

        if (primeEnemy) {
            // Hint about a prime on screen
            return this.generatePrimeHint(primeEnemy.getNumber());
        } else {
            // All enemies are composite, help identify why
            const compositeEnemy = enemies[0];
            return this.generateCompositeHint(compositeEnemy.getNumber());
        }
    }

    generatePrimeHint(number) {
        const hints = [
            `${number} is prime! It's only divisible by 1 and itself.`,
            `Shoot ${number}! Check: no even division by 2, 3, 5, or 7.`,
            `${number} is prime - try dividing by small primes to verify.`
        ];

        // Add specific hints for certain primes
        if (number === 2) {
            return "2 is the ONLY even prime number!";
        }
        if (number === 3) {
            return "3 is prime - it's only divisible by 1 and 3.";
        }
        if (number % 10 === 1 || number % 10 === 3 || number % 10 === 7 || number % 10 === 9) {
            hints.push(`${number} ends in ${number % 10} - could be prime! Check divisibility.`);
        }

        return hints[Math.floor(Math.random() * hints.length)];
    }

    generateCompositeHint(number) {
        const factorization = getFactorizationString(number);

        const hints = [
            `${number} is NOT prime. ${factorization}`,
            `Don't shoot ${number}! It's composite: ${factorization}`,
            `Skip ${number} - it can be factored: ${factorization}`
        ];

        // Add specific hints
        if (number % 2 === 0) {
            hints.push(`${number} is even, so it's divisible by 2. Not prime!`);
        }
        if (number % 5 === 0 && number !== 5) {
            hints.push(`${number} ends in 0 or 5, so it's divisible by 5.`);
        }
        if (this.isDivisibleBy3(number)) {
            hints.push(`${number}'s digits sum to a multiple of 3, so it's divisible by 3.`);
        }

        return hints[Math.floor(Math.random() * hints.length)];
    }

    isDivisibleBy3(n) {
        let sum = 0;
        while (n > 0) {
            sum += n % 10;
            n = Math.floor(n / 10);
        }
        return sum % 3 === 0;
    }

    getRandomPrimeFact() {
        return PRIME_FACTS[Math.floor(Math.random() * PRIME_FACTS.length)];
    }

    displayHint(text) {
        // Remove existing hint if present
        if (this.hintText) {
            this.hintText.destroy();
        }

        // Create hint box
        const boxWidth = 700;
        const boxHeight = 60;
        const boxX = 400;
        const boxY = 500;

        // Semi-transparent background
        const bg = this.scene.add.rectangle(boxX, boxY, boxWidth, boxHeight, 0x000000, 0.8);
        bg.setStrokeStyle(2, 0x00ffff);

        // Hint text
        this.hintText = this.scene.add.text(boxX, boxY, text, {
            fontSize: '16px',
            fill: '#00ffff',
            fontFamily: 'Courier New',
            wordWrap: { width: boxWidth - 20 },
            align: 'center'
        }).setOrigin(0.5);

        // Hints remaining indicator
        const hintsLeft = this.scene.add.text(boxX, boxY + 40,
            `Hints remaining: ${this.hintsRemaining}`, {
            fontSize: '12px',
            fill: '#888888',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);

        // Fade out after display duration
        this.scene.tweens.add({
            targets: [bg, this.hintText, hintsLeft],
            alpha: 0,
            duration: 500,
            delay: CONFIG.HINT_DISPLAY_DURATION,
            onComplete: () => {
                bg.destroy();
                this.hintText.destroy();
                hintsLeft.destroy();
                this.hintText = null;
            }
        });
    }

    showWrongHitFeedback(number) {
        const factorization = getFactorizationString(number);
        const feedback = `${number} was composite! ${factorization}`;

        // Display in red at the top
        const feedbackText = this.scene.add.text(400, 80, feedback, {
            fontSize: '18px',
            fill: '#ff6666',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3,
            backgroundColor: '#330000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);

        this.scene.tweens.add({
            targets: feedbackText,
            alpha: 0,
            y: 60,
            duration: 2500,
            onComplete: () => feedbackText.destroy()
        });
    }

    showMissedPrimeFeedback(number) {
        const feedback = `Missed prime ${number}! Remember: only divisible by 1 and ${number}`;

        const feedbackText = this.scene.add.text(400, 80, feedback, {
            fontSize: '18px',
            fill: '#ff9900',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3,
            backgroundColor: '#332200',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);

        this.scene.tweens.add({
            targets: feedbackText,
            alpha: 0,
            y: 60,
            duration: 2500,
            onComplete: () => feedbackText.destroy()
        });
    }

    getHintsRemaining() {
        return this.hintsRemaining;
    }
}
