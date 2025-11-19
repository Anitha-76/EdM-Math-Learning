export default class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }

    create() {
        // Semi-transparent dark overlay
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);

        // "PAUSED" title
        this.add.text(400, 80, 'PAUSED', {
            fontSize: '64px',
            fill: '#00ffff',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Prime number reference chart
        this.add.text(400, 160, 'Prime Numbers Reference', {
            fontSize: '24px',
            fill: '#ffff00',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const primeList = [
            'Primes 2-50:',
            '2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47',
            '',
            'Primes 51-100:',
            '53, 59, 61, 67, 71, 73, 79, 83, 89, 97',
            '',
            'Quick Tips:',
            '• 2 is the only even prime',
            '• Numbers ending in 0, 2, 4, 5, 6, 8 (except 2, 5) are NOT prime',
            '• Check divisibility by small primes: 2, 3, 5, 7'
        ];

        primeList.forEach((text, index) => {
            this.add.text(400, 200 + index * 24, text, {
                fontSize: '14px',
                fill: '#ffffff',
                fontFamily: 'Courier New',
                align: 'center'
            }).setOrigin(0.5);
        });

        // Resume button
        const resumeBtn = this.add.text(400, 480, 'RESUME', {
            fontSize: '32px',
            fill: '#00ff00',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3,
            backgroundColor: '#003300',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        resumeBtn.on('pointerover', () => {
            resumeBtn.setStyle({ fill: '#ffffff', backgroundColor: '#006600' });
            resumeBtn.setScale(1.1);
        });

        resumeBtn.on('pointerout', () => {
            resumeBtn.setStyle({ fill: '#00ff00', backgroundColor: '#003300' });
            resumeBtn.setScale(1);
        });

        resumeBtn.on('pointerdown', () => this.resumeGame());

        // Quit button
        const quitBtn = this.add.text(400, 550, 'QUIT TO MENU', {
            fontSize: '24px',
            fill: '#ff6666',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2,
            backgroundColor: '#330000',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        quitBtn.on('pointerover', () => {
            quitBtn.setStyle({ fill: '#ffffff', backgroundColor: '#660000' });
            quitBtn.setScale(1.1);
        });

        quitBtn.on('pointerout', () => {
            quitBtn.setStyle({ fill: '#ff6666', backgroundColor: '#330000' });
            quitBtn.setScale(1);
        });

        quitBtn.on('pointerdown', () => this.quitGame());

        // ESC to resume
        this.input.keyboard.on('keydown-ESC', () => this.resumeGame());
    }

    resumeGame() {
        this.scene.resume('GameScene');
        this.scene.stop();
    }

    quitGame() {
        this.scene.stop('GameScene');
        this.scene.stop();
        this.scene.start('MenuScene');
    }
}
