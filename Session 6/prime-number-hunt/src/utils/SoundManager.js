import { CONFIG } from './GameConfig.js';

export default class SoundManager {
    constructor(scene) {
        this.scene = scene;
        this.soundEnabled = this.loadSetting('soundEnabled', true);
        this.musicEnabled = this.loadSetting('musicEnabled', true);
        this.soundVolume = this.loadSetting('soundVolume', CONFIG.DEFAULT_SOUND_VOLUME);
        this.musicVolume = this.loadSetting('musicVolume', CONFIG.DEFAULT_MUSIC_VOLUME);

        // Web Audio API context
        this.audioContext = null;
        this.musicOscillators = [];
        this.musicGain = null;
        this.isMusicPlaying = false;

        this.initAudioContext();
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
        }
    }

    resumeContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    // Sound Effects
    playShoot() {
        if (!this.soundEnabled || !this.audioContext) return;
        this.resumeContext();

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.frequency.setValueAtTime(880, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, this.audioContext.currentTime + 0.1);
        osc.type = 'square';

        gain.gain.setValueAtTime(this.soundVolume * 0.3, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

        osc.start(this.audioContext.currentTime);
        osc.stop(this.audioContext.currentTime + 0.1);
    }

    playCorrectHit() {
        if (!this.soundEnabled || !this.audioContext) return;
        this.resumeContext();

        // Ascending pleasant tone
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.frequency.setValueAtTime(440, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.15);
        osc.type = 'sine';

        gain.gain.setValueAtTime(this.soundVolume * 0.4, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

        osc.start(this.audioContext.currentTime);
        osc.stop(this.audioContext.currentTime + 0.2);
    }

    playWrongHit() {
        if (!this.soundEnabled || !this.audioContext) return;
        this.resumeContext();

        // Descending harsh tone
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.frequency.setValueAtTime(300, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.3);
        osc.type = 'sawtooth';

        gain.gain.setValueAtTime(this.soundVolume * 0.4, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

        osc.start(this.audioContext.currentTime);
        osc.stop(this.audioContext.currentTime + 0.3);
    }

    playPowerUp() {
        if (!this.soundEnabled || !this.audioContext) return;
        this.resumeContext();

        // Sparkly ascending arpeggio
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

        notes.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.connect(gain);
            gain.connect(this.audioContext.destination);

            osc.frequency.value = freq;
            osc.type = 'sine';

            const startTime = this.audioContext.currentTime + i * 0.08;
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.soundVolume * 0.3, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

            osc.start(startTime);
            osc.stop(startTime + 0.15);
        });
    }

    playCombo() {
        if (!this.soundEnabled || !this.audioContext) return;
        this.resumeContext();

        // Rising triumphant sound
        const osc1 = this.audioContext.createOscillator();
        const osc2 = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.audioContext.destination);

        osc1.frequency.setValueAtTime(523.25, this.audioContext.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(1046.50, this.audioContext.currentTime + 0.2);
        osc1.type = 'sine';

        osc2.frequency.setValueAtTime(659.25, this.audioContext.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(1318.51, this.audioContext.currentTime + 0.2);
        osc2.type = 'sine';

        gain.gain.setValueAtTime(this.soundVolume * 0.3, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

        osc1.start(this.audioContext.currentTime);
        osc2.start(this.audioContext.currentTime);
        osc1.stop(this.audioContext.currentTime + 0.3);
        osc2.stop(this.audioContext.currentTime + 0.3);
    }

    playGameOver() {
        if (!this.soundEnabled || !this.audioContext) return;
        this.resumeContext();

        // Sad descending tone
        const notes = [392, 349.23, 329.63, 261.63]; // G4, F4, E4, C4

        notes.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.connect(gain);
            gain.connect(this.audioContext.destination);

            osc.frequency.value = freq;
            osc.type = 'sine';

            const startTime = this.audioContext.currentTime + i * 0.25;
            gain.gain.setValueAtTime(this.soundVolume * 0.4, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

            osc.start(startTime);
            osc.stop(startTime + 0.3);
        });
    }

    playWaveComplete() {
        if (!this.soundEnabled || !this.audioContext) return;
        this.resumeContext();

        // Fanfare
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];

        notes.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.connect(gain);
            gain.connect(this.audioContext.destination);

            osc.frequency.value = freq;
            osc.type = 'square';

            const startTime = this.audioContext.currentTime + i * 0.1;
            gain.gain.setValueAtTime(this.soundVolume * 0.2, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

            osc.start(startTime);
            osc.stop(startTime + 0.2);
        });
    }

    // Background Music
    startMusic() {
        if (!this.musicEnabled || !this.audioContext || this.isMusicPlaying) return;
        this.resumeContext();

        this.isMusicPlaying = true;
        this.musicGain = this.audioContext.createGain();
        this.musicGain.connect(this.audioContext.destination);
        this.musicGain.gain.value = this.musicVolume * 0.15;

        // Create ambient space music with multiple oscillators
        this.playMusicLoop();
    }

    playMusicLoop() {
        if (!this.isMusicPlaying || !this.audioContext) return;

        // Bass drone
        const bassOsc = this.audioContext.createOscillator();
        const bassGain = this.audioContext.createGain();
        bassOsc.connect(bassGain);
        bassGain.connect(this.musicGain);
        bassOsc.frequency.value = 55; // A1
        bassOsc.type = 'sine';
        bassGain.gain.value = 0.5;
        bassOsc.start();
        this.musicOscillators.push({ osc: bassOsc, gain: bassGain });

        // Ambient pad
        const padOsc = this.audioContext.createOscillator();
        const padGain = this.audioContext.createGain();
        padOsc.connect(padGain);
        padGain.connect(this.musicGain);
        padOsc.frequency.value = 220; // A3
        padOsc.type = 'sine';
        padGain.gain.value = 0.3;
        padOsc.start();
        this.musicOscillators.push({ osc: padOsc, gain: padGain });

        // Slowly modulating pad
        const lfo = this.audioContext.createOscillator();
        const lfoGain = this.audioContext.createGain();
        lfo.connect(lfoGain);
        lfoGain.connect(padOsc.frequency);
        lfo.frequency.value = 0.1;
        lfoGain.gain.value = 10;
        lfo.start();
        this.musicOscillators.push({ osc: lfo, gain: lfoGain });

        // High shimmer
        const shimmerOsc = this.audioContext.createOscillator();
        const shimmerGain = this.audioContext.createGain();
        shimmerOsc.connect(shimmerGain);
        shimmerGain.connect(this.musicGain);
        shimmerOsc.frequency.value = 880;
        shimmerOsc.type = 'sine';
        shimmerGain.gain.value = 0.1;
        shimmerOsc.start();
        this.musicOscillators.push({ osc: shimmerOsc, gain: shimmerGain });
    }

    stopMusic() {
        this.isMusicPlaying = false;

        this.musicOscillators.forEach(({ osc }) => {
            try {
                osc.stop();
            } catch (e) {
                // Already stopped
            }
        });
        this.musicOscillators = [];
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        this.saveSetting('musicVolume', this.musicVolume);

        if (this.musicGain) {
            this.musicGain.gain.value = this.musicVolume * 0.15;
        }
    }

    setSoundEnabled(enabled) {
        this.soundEnabled = enabled;
        this.saveSetting('soundEnabled', enabled);
    }

    setMusicEnabled(enabled) {
        this.musicEnabled = enabled;
        this.saveSetting('musicEnabled', enabled);

        if (!enabled) {
            this.stopMusic();
        }
    }

    setSoundVolume(volume) {
        this.soundVolume = Math.max(0, Math.min(1, volume));
        this.saveSetting('soundVolume', this.soundVolume);
    }

    saveSetting(key, value) {
        try {
            localStorage.setItem(`primeHunt_sound_${key}`, JSON.stringify(value));
        } catch (e) {
            console.warn('Could not save sound setting:', e);
        }
    }

    loadSetting(key, defaultValue) {
        try {
            const saved = localStorage.getItem(`primeHunt_sound_${key}`);
            return saved !== null ? JSON.parse(saved) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    }
}
