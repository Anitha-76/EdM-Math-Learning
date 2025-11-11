class CheckerboardPuzzleGame extends Phaser.Scene {
    constructor() {
        super({ key: 'CheckerboardPuzzleGame' });
        this.stoppedTiles = new Set();
        this.totalTiles = 0;
        this.gameEnded = false;
    }

    preload() {
        // Load the checkerboard sprite from Phaser CDN
        this.load.setBaseURL('https://cdn.phaserfiles.com/v385');
        this.load.image('block', 'assets/sprites/checkerboard.png');
    }

    create() {
        // Create a grid of checkerboard blocks
        const gridWidth = 10;
        const gridHeight = 8;
        this.totalTiles = gridWidth * gridHeight;

        const blocks = this.add.group({ key: 'block', repeat: this.totalTiles - 1 });

        // Arrange blocks in a grid
        Phaser.Actions.GridAlign(blocks.getChildren(), {
            width: gridWidth,
            height: gridHeight,
            cellWidth: 64,
            cellHeight: 64,
            x: 100,
            y: 50
        });

        const angles = [0, 90, 180, 270];

        // Set up each block with rotation animation and click interaction
        blocks.children.iterate(child => {
            // Set random initial angle
            child.angle = Phaser.Math.RND.pick(angles);

            // Make the block interactive
            child.setInteractive({ useHandCursor: true });

            // Store the tween reference on the child
            child.rotationTween = this.tweens.add({
                targets: child,
                ease: 'Power1',
                duration: 300,
                delay: Math.random() * 3000,
                repeatDelay: 2000 + Math.random() * 4000,
                repeat: -1,
                angle: {
                    getEnd: (target, key, value) => {
                        const rotationAmount = Math.random() > 0.5 ? 90 : 180;
                        const direction = Math.random() > 0.5 ? 1 : -1;
                        return target.angle + (rotationAmount * direction);
                    },
                    getStart: (target, key, value) => {
                        return target.angle;
                    }
                }
            });

            // Store whether this tile is stopped
            child.isStopped = false;

            // Add click event
            child.on('pointerdown', () => this.onTileClick(child));

            // Add hover effect
            child.on('pointerover', () => {
                if (!child.isStopped) {
                    child.setTint(0xffff00); // Yellow tint on hover
                }
            });

            child.on('pointerout', () => {
                if (!child.isStopped) {
                    child.clearTint();
                }
            });
        });

        // Store blocks group for later access
        this.blocks = blocks;

        // Update UI
        this.updateUI();

        // Add instructions text
        this.add.text(400, 560, 'Click tiles to stop them rotating', {
            fontSize: '20px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
    }

    onTileClick(tile) {
        // Don't allow clicking if already stopped
        if (tile.isStopped) {
            return;
        }

        // Stop the rotation tween
        if (tile.rotationTween) {
            tile.rotationTween.stop();
        }

        // Mark as stopped
        tile.isStopped = true;
        this.stoppedTiles.add(tile);

        // Visual feedback - green tint for stopped tiles
        tile.setTint(0x00ff00);

        // Make it non-interactive
        tile.disableInteractive();

        // Update UI
        this.updateUI();

        // Check if game is complete
        if (this.stoppedTiles.size === this.totalTiles) {
            this.endGame();
        }
    }

    updateUI() {
        // Update the HTML UI elements
        document.getElementById('stopped-count').textContent = this.stoppedTiles.size;
        document.getElementById('total-count').textContent = this.totalTiles;
    }

    endGame() {
        if (this.gameEnded) return;
        this.gameEnded = true;

        // Calculate the score based on pattern regularity
        const score = this.calculatePatternScore();

        // Display the score
        const scoreText = this.add.text(400, 300, `Game Complete!\n\nPattern Score: ${score}/100`, {
            fontSize: '36px',
            fill: '#ffffff',
            align: 'center',
            backgroundColor: '#000000',
            padding: { x: 20, y: 20 }
        }).setOrigin(0.5);

        // Add restart button
        const restartButton = this.add.text(400, 400, 'Click to Restart', {
            fontSize: '24px',
            fill: '#4CAF50',
            align: 'center',
            backgroundColor: '#333333',
            padding: { x: 15, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        restartButton.on('pointerdown', () => {
            this.scene.restart();
            this.stoppedTiles.clear();
            this.gameEnded = false;
        });

        restartButton.on('pointerover', () => {
            restartButton.setStyle({ fill: '#66ff66' });
        });

        restartButton.on('pointerout', () => {
            restartButton.setStyle({ fill: '#4CAF50' });
        });

        // Update instructions
        document.getElementById('instructions').innerHTML =
            `<span class="highlight">Game Complete!</span> Your pattern regularity score is ${score}/100. Higher scores mean more uniform patterns.`;
    }

    calculatePatternScore() {
        // Get all tiles and their angles
        const tiles = this.blocks.getChildren();
        const angles = tiles.map(tile => {
            // Normalize angle to 0-360 range
            let angle = tile.angle % 360;
            if (angle < 0) angle += 360;
            // Round to nearest 90 degrees
            return Math.round(angle / 90) * 90 % 360;
        });

        // Count occurrences of each angle
        const angleCount = {};
        angles.forEach(angle => {
            angleCount[angle] = (angleCount[angle] || 0) + 1;
        });

        // Calculate uniformity score
        // The more uniform the distribution, the higher the score
        const totalTiles = angles.length;
        const idealCount = totalTiles / 4; // Ideal is equal distribution among 4 angles

        // Calculate variance from ideal distribution
        let variance = 0;
        [0, 90, 180, 270].forEach(angle => {
            const count = angleCount[angle] || 0;
            variance += Math.pow(count - idealCount, 2);
        });

        // Normalize variance to a score (0-100)
        // Lower variance = higher score
        const maxVariance = Math.pow(totalTiles, 2); // Maximum possible variance
        const normalizedVariance = variance / maxVariance;
        const uniformityScore = Math.round((1 - normalizedVariance) * 100);

        // Also check for patterns (adjacent tiles with same orientation get bonus)
        let patternBonus = 0;
        const gridWidth = 10;
        tiles.forEach((tile, index) => {
            const row = Math.floor(index / gridWidth);
            const col = index % gridWidth;

            // Check right neighbor
            if (col < gridWidth - 1) {
                const rightIndex = index + 1;
                if (angles[index] === angles[rightIndex]) {
                    patternBonus += 1;
                }
            }

            // Check bottom neighbor
            if (row < 7) { // 8 rows total
                const bottomIndex = index + gridWidth;
                if (angles[index] === angles[bottomIndex]) {
                    patternBonus += 1;
                }
            }
        });

        // Bonus score from patterns (max 20 points)
        const maxPossiblePatterns = (gridWidth - 1) * 8 + 10 * 7; // horizontal + vertical adjacencies
        const patternScore = Math.round((patternBonus / maxPossiblePatterns) * 20);

        return Math.min(100, uniformityScore + patternScore);
    }
}

// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-game',
    scene: CheckerboardPuzzleGame
};

// Create the game instance
const game = new Phaser.Game(config);
