export class AmbientEngine {
  public ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isRunning: boolean = false;

  public async init() {
    if (this.isRunning) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
    this.masterGain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 2);
    this.isRunning = true;
  }

  public pauseForVoice() { if (this.masterGain) this.masterGain.gain.setTargetAtTime(0.02, this.ctx!.currentTime, 0.2); }
  public resumeAfterVoice() { if (this.masterGain) this.masterGain.gain.setTargetAtTime(0.1, this.ctx!.currentTime, 0.5); }
  public updateMood(tab: string) {}
}

export const ambientEngine = new AmbientEngine();