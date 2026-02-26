import * as Tone from 'tone';

class AudioEngine {
  private synth: Tone.PolySynth | null = null;
  private ambientSynth: Tone.PolySynth | null = null;
  private melodySynth: Tone.PolySynth | null = null;
  private textureSynth: Tone.PluckSynth | null = null;
  
  private melodyPattern: Tone.Pattern<string> | null = null;
  private textureLoop: Tone.Loop | null = null;
  private droneLoop: Tone.Loop | null = null;
  
  private isInitialized = false;
  private isPlayingAmbient = false;
  private currentVibrancy = 0.5;

  async init() {
    if (this.isInitialized) return;
    
    await Tone.start();
    
    // Master effects
    const reverb = new Tone.Reverb({
      decay: 5,
      wet: 0.4
    }).toDestination();
    
    const delay = new Tone.FeedbackDelay("8n.", 0.3).connect(reverb);

    // 1. Interaction Synth (Watering/UI) - Warm, analog-style poly synth
    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.05, decay: 0.2, sustain: 0.4, release: 1.5 }
    }).connect(reverb);

    // 2. Ambient Drone Synth - Deep and sustained
    this.ambientSynth = new Tone.PolySynth(Tone.AMSynth, {
      harmonicity: 2.5,
      oscillator: { type: "sine" },
      envelope: { attack: 2, decay: 2, sustain: 1, release: 4 },
      modulation: { type: "square" }
    }).connect(reverb);
    this.ambientSynth.volume.value = -20;

    // 3. Melody Synth - Bright and plucky for high vibrancy
    this.melodySynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "fatsawtooth" },
      envelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 1 }
    }).connect(delay);
    this.melodySynth.volume.value = -15;

    // 4. Texture Synth - Sparkles/Organic noises
    this.textureSynth = new Tone.PluckSynth({
      attackNoise: 1,
      dampening: 4000,
      resonance: 0.9
    }).connect(reverb);
    this.textureSynth.volume.value = -12;

    this.isInitialized = true;
  }

  playWateringSound() {
    if (!this.synth) return;
    const now = Tone.now();
    this.synth.triggerAttackRelease("C4", "8n", now);
    this.synth.triggerAttackRelease("E4", "8n", now + 0.1);
    this.synth.triggerAttackRelease("G4", "8n", now + 0.2);
    this.synth.triggerAttackRelease("C5", "4n", now + 0.3);
  }

  playMistSound() {
    const noise = new Tone.Noise("white").start();
    const filter = new Tone.Filter(1000, "lowpass").toDestination();
    const env = new Tone.AmplitudeEnvelope({
      attack: 0.1, decay: 0.5, sustain: 0, release: 0.1
    }).connect(filter);
    
    noise.connect(env);
    env.triggerAttackRelease(0.5);
    
    setTimeout(() => {
      noise.stop();
      noise.dispose();
      env.dispose();
      filter.dispose();
    }, 1000);
  }

  // Generative Ambient Logic
  startAmbient(vibrancy: number) {
    if (!this.isInitialized || this.isPlayingAmbient) return;
    this.isPlayingAmbient = true;
    this.currentVibrancy = vibrancy;
    Tone.Transport.start();

    // Setup Drone
    this.droneLoop = new Tone.Loop((time) => {
      if (!this.ambientSynth) return;
      // Lower vibrancy = darker/lower chords
      const chord = this.currentVibrancy > 0.5 ? ["C3", "G3", "E3"] : ["C2", "G2"];
      this.ambientSynth.triggerAttackRelease(chord, "4m", time);
    }, "4m").start(0);

    // Setup Melody (Arpeggios)
    const notes = ["C4", "E4", "G4", "B4", "C5", "E5"];
    this.melodyPattern = new Tone.Pattern((time, note) => {
      if (!this.melodySynth) return;
      // Probability based on vibrancy
      if (Math.random() < this.currentVibrancy) {
        this.melodySynth.triggerAttackRelease(note, "8n", time);
      }
    }, notes, "upDown");
    this.melodyPattern.interval = "8n";
    this.melodyPattern.start(0);

    // Setup Texture (Random sparkles)
    this.textureLoop = new Tone.Loop((time) => {
      if (!this.textureSynth) return;
      if (this.currentVibrancy > 0.7 && Math.random() > 0.6) {
        const note = notes[Math.floor(Math.random() * notes.length)];
        this.textureSynth.triggerAttackRelease(note, time);
      }
    }, "4n").start(0);
  }

  stopAmbient() {
    if (!this.isPlayingAmbient) return;
    this.isPlayingAmbient = false;
    
    this.droneLoop?.stop();
    this.droneLoop?.dispose();
    this.melodyPattern?.stop();
    this.melodyPattern?.dispose();
    this.textureLoop?.stop();
    this.textureLoop?.dispose();
    
    // Release any hanging notes
    this.ambientSynth?.releaseAll();
    this.melodySynth?.releaseAll();
    
    Tone.Transport.stop();
  }

  updateVibrancy(vibrancy: number) {
    this.currentVibrancy = vibrancy;
    // Adjust volume/filter based on vibrancy immediately if needed
    if (this.melodySynth) {
      // Mute melody if vibrancy is very low
      this.melodySynth.volume.rampTo(vibrancy < 0.3 ? -Infinity : -15, 1);
    }
  }
}

export const audioEngine = new AudioEngine();
