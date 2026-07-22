export class SoundFX {
  private static ctx: AudioContext | null = null;
  private static muted: boolean = false;

  private static getCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    return this.ctx;
  }

  static toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  static isMuted() {
    return this.muted;
  }

  private static playTone(
    freqs: number[],
    times: number[],
    type: OscillatorType = "sine",
    gainVal: number = 0.1
  ) {
    const context = this.getCtx();
    if (!context || this.muted) return;
    if (context.state === "suspended") {
      context.resume();
    }

    try {
      const now = context.currentTime;
      const osc = context.createOscillator();
      const gainNode = context.createGain();

      osc.type = type;
      osc.connect(gainNode);
      gainNode.connect(context.destination);

      osc.frequency.setValueAtTime(freqs[0], now);
      gainNode.gain.setValueAtTime(gainVal, now);

      for (let i = 1; i < freqs.length; i++) {
        osc.frequency.exponentialRampToValueAtTime(freqs[i], now + times[i]);
      }

      gainNode.gain.exponentialRampToValueAtTime(0.001, now + times[times.length - 1]);

      osc.start(now);
      osc.stop(now + times[times.length - 1] + 0.05);
    } catch (e) {
      console.warn("Audio failed", e);
    }
  }

  static playSlash() {
    this.playTone([400, 150, 50], [0, 0.07, 0.12], "triangle", 0.15);
  }

  static playFireball() {
    this.playTone([180, 700, 80], [0, 0.08, 0.25], "sawtooth", 0.07);
  }

  static playDash() {
    this.playTone([80, 1000], [0, 0.1], "sine", 0.15);
  }

  static playSlam() {
    this.playTone([120, 30, 5], [0, 0.18, 0.35], "sawtooth", 0.22);
  }

  static playHit() {
    this.playTone([350, 180], [0, 0.06], "sine", 0.12);
  }

  static playHurt() {
    this.playTone([150, 50], [0, 0.12], "sawtooth", 0.18);
  }

  static playHeal() {
    this.playTone([220, 440, 880], [0, 0.08, 0.22], "sine", 0.08);
  }

  static playShield() {
    this.playTone([300, 600, 300, 900], [0, 0.07, 0.15, 0.25], "sine", 0.08);
  }
}
