// Web Audio engine for realistic Pakistani Bazaar beat and TTS speech sync

class SoundEngine {
  private audioCtx: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private isBgmPlaying = false;
  private bgmGainNode: GainNode | null = null;
  private bgmIntervalId: any = null;

  public init() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Play base64 WAV audio (e.g. from Gemini TTS)
  public async playBase64Audio(
    base64Data: string,
    onEnded?: () => void,
    onViseme?: (openRatio: number) => void
  ): Promise<void> {
    this.stopSpeech();
    this.init();

    try {
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      if (this.audioCtx) {
        const audioBuffer = await this.audioCtx.decodeAudioData(bytes.buffer);
        const source = this.audioCtx.createBufferSource();
        source.buffer = audioBuffer;

        // Analyser for mouth movement / visemes
        const analyser = this.audioCtx.createAnalyser();
        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        source.connect(analyser);
        analyser.connect(this.audioCtx.destination);

        let animationFrameId: number;
        const updateViseme = () => {
          if (!this.currentSource) return;
          analyser.getByteFrequencyData(dataArray);
          // calculate average amplitude
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          // Normalize to 0 - 1 mouth opening ratio
          const ratio = Math.min(1, Math.max(0, (avg - 15) / 50));
          if (onViseme) onViseme(ratio);
          animationFrameId = requestAnimationFrame(updateViseme);
        };

        source.onended = () => {
          cancelAnimationFrame(animationFrameId);
          if (onViseme) onViseme(0);
          this.currentSource = null;
          if (onEnded) onEnded();
        };

        this.currentSource = source;
        source.start();
        updateViseme();
      }
    } catch (e) {
      console.warn('Audio decoding fallback to HTMLAudio:', e);
      const audioUrl = `data:audio/wav;base64,${base64Data}`;
      this.audioElement = new Audio(audioUrl);
      this.audioElement.onended = () => {
        if (onViseme) onViseme(0);
        if (onEnded) onEnded();
      };
      this.audioElement.play();
      this.simulateVisemeLoop(onViseme);
    }
  }

  // Browser speech synthesis fallback (offline or instant preview)
  public speakText(
    text: string,
    language: string,
    onEnded?: () => void,
    onViseme?: (openRatio: number) => void
  ) {
    this.stopSpeech();

    if (!('speechSynthesis' in window)) {
      if (onEnded) onEnded();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const langMap: Record<string, string> = {
      Urdu: 'ur-PK',
      Punjabi: 'pa-PK',
      Saraiki: 'ur-PK',
      Pashto: 'ps-AF',
      English: 'en-US',
    };

    utterance.lang = langMap[language] || 'ur-PK';
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    // Simulate animated mouth movement loop during speech
    let isSpeaking = true;
    this.simulateVisemeLoop((ratio) => {
      if (isSpeaking && onViseme) {
        onViseme(ratio);
      }
    });

    utterance.onend = () => {
      isSpeaking = false;
      if (onViseme) onViseme(0);
      if (onEnded) onEnded();
    };

    utterance.onerror = () => {
      isSpeaking = false;
      if (onViseme) onViseme(0);
      if (onEnded) onEnded();
    };

    window.speechSynthesis.speak(utterance);
  }

  // Realistic mouth viseme simulation generator for talking avatars
  private simulateVisemeLoop(onViseme?: (ratio: number) => void) {
    if (!onViseme) return;
    let step = 0;
    const interval = setInterval(() => {
      step += 0.25;
      // create speech cadence wave: alternating vowels and closures
      const wave = Math.sin(step) * 0.5 + Math.sin(step * 2.3) * 0.3;
      const opening = Math.max(0, Math.min(1, wave * 0.85 + 0.15));
      onViseme(opening);
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
      onViseme(0);
    }, 12000);
  }

  // Web Audio procedural background beats: Dholak / upbeat Punjabi-Pakistani bazaar percussion
  public startBackgroundMusic(mood: string = 'energetic_bazaar', volume: number = 0.25) {
    this.stopBackgroundMusic();
    this.init();

    if (!this.audioCtx) return;
    this.isBgmPlaying = true;

    const ctx = this.audioCtx;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume, ctx.currentTime);
    masterGain.connect(ctx.destination);
    this.bgmGainNode = masterGain;

    let step = 0;
    const tempoMs = mood === 'celebration_dhol' ? 260 : 310;

    const playBeat = () => {
      if (!this.isBgmPlaying || !this.audioCtx) return;
      const now = ctx.currentTime;

      // 1. Dholak / Bass Drum (Ghum)
      if (step % 4 === 0 || step % 8 === 6) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);

        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.25);
      }

      // 2. High snap / Tabla Taa / Clapper
      if (step % 2 === 1 || step % 8 === 2) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(mood === 'festive_eid' ? 380 : 440, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.1);
      }

      // 3. Melodic ambient drone
      if (step % 16 === 0) {
        const chordOsc = ctx.createOscillator();
        const chordGain = ctx.createGain();
        chordOsc.type = 'sine';
        chordOsc.frequency.setValueAtTime(mood === 'festive_eid' ? 293.66 : 220, now); // D or A
        chordGain.gain.setValueAtTime(0.05, now);
        chordGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        chordOsc.connect(chordGain);
        chordGain.connect(masterGain);
        chordOsc.start(now);
        chordOsc.stop(now + 1.2);
      }

      step++;
    };

    this.bgmIntervalId = setInterval(playBeat, tempoMs);
  }

  public stopBackgroundMusic() {
    this.isBgmPlaying = false;
    if (this.bgmIntervalId) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }

  public stopSpeech() {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch (e) {}
      this.currentSource = null;
    }
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public stopAll() {
    this.stopSpeech();
    this.stopBackgroundMusic();
  }
}

export const soundEngine = new SoundEngine();
