"use client";

export type StemAudio = {
  buffer: AudioBuffer;
  gainNode: GainNode;
  sourceNode?: AudioBufferSourceNode;
};

export class AudioMixer {
  private context: AudioContext;
  private stems: Map<string, StemAudio> = new Map();
  private analyser: AnalyserNode;
  private destination: MediaStreamAudioDestinationNode | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];

  constructor() {
    this.context = new AudioContext();
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.connect(this.context.destination);
  }

  async loadStem(id: string, url: string, stemType: string): Promise<void> {
    const res = await fetch(url);
    const arrayBuffer = await res.arrayBuffer();
    const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
    const gainNode = this.context.createGain();
    gainNode.connect(this.analyser);
    this.stems.set(id, { buffer: audioBuffer, gainNode });
  }

  setGain(id: string, value: number): void {
    const stem = this.stems.get(id);
    if (stem) stem.gainNode.gain.value = value;
  }

  play(): void {
    if (this.context.state === "suspended") this.context.resume();
    this.stems.forEach((stem, id) => {
      const source = this.context.createBufferSource();
      source.buffer = stem.buffer;
      source.connect(stem.gainNode);
      source.start(0);
      stem.sourceNode = source;
      this.stems.set(id, stem);
    });
  }

  stop(): void {
    this.stems.forEach((stem) => {
      try { stem.sourceNode?.stop(); } catch {}
    });
  }

  startRecording(): void {
    this.destination = this.context.createMediaStreamDestination();
    this.analyser.connect(this.destination);
    this.recordedChunks = [];
    this.mediaRecorder = new MediaRecorder(this.destination.stream);
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.recordedChunks.push(e.data);
    };
    this.mediaRecorder.start();
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve(new Blob([], { type: "audio/webm" }));
        return;
      }
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: "audio/webm" });
        resolve(blob);
      };
      this.mediaRecorder.stop();
    });
  }

  getAnalyserData(): Uint8Array {
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(data);
    return data;
  }

  hasStem(id: string): boolean {
    return this.stems.has(id);
  }

  getStemCount(): number {
    return this.stems.size;
  }

  dispose(): void {
    this.stop();
    this.context.close();
  }
}
