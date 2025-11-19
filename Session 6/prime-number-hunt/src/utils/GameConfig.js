export const CONFIG = {
    PLAYER_SPEED: 300,
    PLAYER_FIRE_RATE: 250, // milliseconds between shots
    BULLET_SPEED: 400,
    ENEMY_SPEED: 80,
    ENEMY_SPAWN_RATE: 2000, // milliseconds
    MAX_SIMULTANEOUS_ENEMIES: 5,
    STARTING_LIVES: 3,
    SCORE_CORRECT_HIT: 10,
    SCORE_WRONG_HIT: -5,
    NUMBER_RANGE_MIN: 2,
    NUMBER_RANGE_MAX: 30,

    // Wave System
    WAVE_DURATION: 30000, // 30 seconds per wave
    WAVE_CLEAR_BONUS: 50,
    ENEMIES_PER_WAVE_BASE: 15,
    ENEMIES_PER_WAVE_INCREMENT: 5,

    // Difficulty Scaling
    SPEED_INCREASE_PER_WAVE: 10,
    SPAWN_RATE_DECREASE_PER_WAVE: 100,
    MIN_SPAWN_RATE: 800,
    NUMBER_RANGE_INCREASE_PER_WAVE: 10,
    MAX_NUMBER_RANGE: 200,

    // Power-ups
    POWERUP_DURATION: 5000,
    POWERUP_FALL_SPEED: 100,
    POWERUP_SIZE: 40,

    // Fibonacci Sequence for power-up spawning
    FIBONACCI_SEQUENCE: [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233],

    // Visual Effects
    COMBO_THRESHOLD: 3,
    COMBO_TIMEOUT: 3000,
    SCREEN_SHAKE_DURATION: 200,
    PARTICLE_LIFESPAN: 800,

    // Hint System
    HINTS_PER_WAVE: 3,
    HINT_COOLDOWN: 5000,
    HINT_DISPLAY_DURATION: 4000,

    // Achievement Thresholds
    ACCURACY_MASTER_THRESHOLD: 90,
    SPEED_DEMON_TIME: 60000, // 60 seconds
    PERFECTIONIST_WAVES: 3,
    PRIME_EXPERT_STREAK: 10,
    WAVE_MASTER_WAVES: 10,
    MATHEMATICIAN_SCORE: 1000,

    // Time Attack Mode
    TIME_ATTACK_DURATION: 60000, // 60 seconds
    TIME_ATTACK_BONUS_PER_CORRECT: 500, // 0.5 seconds bonus
    TIME_ATTACK_PENALTY_PER_WRONG: 2000, // 2 seconds penalty

    // Endless Mode
    ENDLESS_LIVES: 5,
    ENDLESS_LIFE_RESTORE_INTERVAL: 50, // Every 50 correct hits
    ENDLESS_DIFFICULTY_RAMP: 0.05, // 5% speed increase per wave

    // Leaderboard
    MAX_LEADERBOARD_ENTRIES: 10,

    // Sound Settings
    DEFAULT_SOUND_VOLUME: 0.5,
    DEFAULT_MUSIC_VOLUME: 0.3
};

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
    EASY: {
        name: 'Easy',
        speedMultiplier: 0.7,
        spawnRateMultiplier: 1.5,
        numberRangeMax: 50,
        lives: 5
    },
    NORMAL: {
        name: 'Normal',
        speedMultiplier: 1.0,
        spawnRateMultiplier: 1.0,
        numberRangeMax: 100,
        lives: 3
    },
    HARD: {
        name: 'Hard',
        speedMultiplier: 1.3,
        spawnRateMultiplier: 0.7,
        numberRangeMax: 200,
        lives: 2
    },
    EXPERT: {
        name: 'Expert',
        speedMultiplier: 1.6,
        spawnRateMultiplier: 0.5,
        numberRangeMax: 300,
        lives: 1
    }
};

// Twin Primes (for challenge mode)
export const TWIN_PRIMES = [
    [3, 5], [5, 7], [11, 13], [17, 19], [29, 31], [41, 43],
    [59, 61], [71, 73], [101, 103], [107, 109], [137, 139],
    [149, 151], [179, 181], [191, 193], [197, 199]
];

// Mersenne Primes
export const MERSENNE_PRIMES = [3, 7, 31, 127];

// Fibonacci Primes
export const FIBONACCI_PRIMES = [2, 3, 5, 13, 89];

// Prime Facts for educational hints
export const PRIME_FACTS = [
    "2 is the only even prime number!",
    "1 is not considered a prime number.",
    "Every number greater than 1 is either prime or can be factored into primes.",
    "The largest known prime has over 24 million digits!",
    "There are infinitely many prime numbers.",
    "Twin primes are pairs like (3,5), (11,13), (17,19).",
    "A prime number has exactly two factors: 1 and itself.",
    "The number 0 and 1 are neither prime nor composite.",
    "Mersenne primes are primes of the form 2^n - 1.",
    "The prime numbers under 30 are: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29."
];

// Achievements
export const ACHIEVEMENTS = {
    FIRST_BLOOD: {
        id: 'first_blood',
        name: 'First Blood',
        description: 'Destroy your first prime number',
        icon: '🎯',
        condition: 'correctHits >= 1'
    },
    ACCURACY_MASTER: {
        id: 'accuracy_master',
        name: 'Accuracy Master',
        description: 'Achieve 90% accuracy in a game',
        icon: '🎯',
        condition: 'accuracy >= 90'
    },
    SPEED_DEMON: {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Destroy 20 primes in under 60 seconds',
        icon: '⚡',
        condition: 'speedRun'
    },
    PERFECTIONIST: {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Complete 3 waves without hitting a composite',
        icon: '✨',
        condition: 'perfectWaves >= 3'
    },
    PRIME_EXPERT: {
        id: 'prime_expert',
        name: 'Prime Expert',
        description: 'Get a 10-prime hit streak',
        icon: '🧠',
        condition: 'maxStreak >= 10'
    },
    WAVE_MASTER: {
        id: 'wave_master',
        name: 'Wave Master',
        description: 'Reach wave 10',
        icon: '🌊',
        condition: 'waveReached >= 10'
    },
    MATHEMATICIAN: {
        id: 'mathematician',
        name: 'Mathematician',
        description: 'Score 1000 points in a single game',
        icon: '🔢',
        condition: 'score >= 1000'
    },
    NO_HINTS: {
        id: 'no_hints',
        name: 'No Hints Needed',
        description: 'Complete a game without using any hints',
        icon: '🧩',
        condition: 'hintsUsed === 0'
    },
    COMBO_KING: {
        id: 'combo_king',
        name: 'Combo King',
        description: 'Get a 5x combo',
        icon: '👑',
        condition: 'maxCombo >= 5'
    },
    SURVIVOR: {
        id: 'survivor',
        name: 'Survivor',
        description: 'Win a game with only 1 life remaining',
        icon: '💪',
        condition: 'survivorWin'
    }
};

// Power-up Types
export const POWERUP_TYPES = {
    SHIELD: {
        name: 'Shield',
        color: 0x00ffff,
        icon: 'S',
        description: 'Protects from one wrong hit'
    },
    SLOW_MOTION: {
        name: 'Slow Motion',
        color: 0x9966ff,
        icon: 'T',
        description: 'Slows enemies for 5 seconds'
    },
    PRIME_VISION: {
        name: 'Prime Vision',
        color: 0x00ff00,
        icon: 'V',
        description: 'Highlights primes for 3 seconds'
    },
    RAPID_FIRE: {
        name: 'Rapid Fire',
        color: 0xff6600,
        icon: 'R',
        description: 'Double fire rate for 5 seconds'
    },
    SCORE_MULTIPLIER: {
        name: '2x Score',
        color: 0xffff00,
        icon: '2',
        description: '2x points for 10 seconds'
    },
    LIFE_RESTORE: {
        name: 'Extra Life',
        color: 0xff0066,
        icon: '+',
        description: 'Gain +1 life'
    },
    FREEZE: {
        name: 'Freeze',
        color: 0x66ccff,
        icon: 'F',
        description: 'Stops all enemies for 3 seconds'
    }
};
