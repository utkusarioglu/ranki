import type {
  Amplitude,
  Note,
  Waveform,
  DestinationNodes,
} from "./audio-synthesis.types.mts";

export class AudioSynthesis {
  private nodes: DestinationNodes[] = [];
  private base = 400;
  private context!: AudioContext;
  private equal = Array(13)
    .fill(this.base)
    .map((f, i) => f * 2 ** (i / 12));

  constructor(notes: Note[]) {
    this.constructMulti(notes);
  }

  private constructMulti(notes: Note[]) {
    if (!this.context) {
      this.context = new window.AudioContext();
    }
    const amplitudeTotal = notes.reduce((a, c) => {
      a += c.amplitude;
      return a;
    }, 0);

    notes.forEach((note) => {
      this.constructSingle(
        // context,
        note.waveform,
        this.equal[note.step],
        note.amplitude / amplitudeTotal,
      );
    });
  }

  private constructSingle(
    // context: AudioContext,
    waveform: Waveform,
    freq: number,
    amplitude: Amplitude,
  ) {
    console.log({ waveform, freq, amplitude });
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = waveform;
    osc.frequency.setValueAtTime(freq, this.context.currentTime);
    gain.gain.setValueAtTime(amplitude, this.context.currentTime);

    osc.connect(gain);
    gain.connect(this.context.destination);
    this.nodes.push({ osc, gain });
  }

  play() {
    console.log("playing...", this.equal);
    this.nodes.forEach((osc) => osc.osc.start());
  }

  stop() {
    this.nodes.forEach((node) => {
      node.osc.stop();
      node.osc.disconnect(node.gain);
      node.gain.disconnect(this.context.destination);
      // @ts-expect-error
      delete node.gain;
      // @ts-expect-error
      delete node.osc;
    });

    this.context
      .close()
      .then(() => console.log("closed"))
      .catch(() => console.log("fail during close"));
  }
}
