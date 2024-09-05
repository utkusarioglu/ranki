export type Waveform = "sine" | "triangle" | "sawtooth" | "square";
export type Amplitude = number;
export type Step = number;

export type Note = {
  step: Step;
  waveform: Waveform;
  amplitude: Amplitude;
};

export type DestinationNodes = {
  osc: OscillatorNode;
  gain: GainNode;
};
