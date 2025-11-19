import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import ModeSelectScene from './scenes/ModeSelectScene.js';
import GameScene from './scenes/GameScene.js';
import TimeAttackScene from './scenes/TimeAttackScene.js';
import EndlessScene from './scenes/EndlessScene.js';
import ChallengeScene from './scenes/ChallengeScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import PauseScene from './scenes/PauseScene.js';
import StatsScene from './scenes/StatsScene.js';
import AchievementsScene from './scenes/AchievementsScene.js';
import LeaderboardScene from './scenes/LeaderboardScene.js';
import SettingsScene from './scenes/SettingsScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#0a0a1a',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [
        BootScene,
        MenuScene,
        ModeSelectScene,
        GameScene,
        TimeAttackScene,
        EndlessScene,
        ChallengeScene,
        GameOverScene,
        PauseScene,
        StatsScene,
        AchievementsScene,
        LeaderboardScene,
        SettingsScene
    ]
};

const game = new Phaser.Game(config);
