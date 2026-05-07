import * as Tone from "tone";

interface NotePack {
  element: HTMLSpanElement;
  note: string;
}

export function stopTone() {
  Tone.getTransport().stop();
}

export function killTone() {
  const ctx = Tone.getContext();

  // Stop the transport for this context
  ctx.transport.stop();
  ctx.transport.cancel(); // clear scheduled events

  // Dispose nodes if you have references
  // Example: synth.dispose(), player.dispose(), etc.
  // Close the underlying AudioContext
  if (ctx.rawContext.state !== "closed") {
    // @ts-expect-error
    ctx.rawContext.close();
  }

  // Reset Tone's context so new sounds can be played later
  Tone.setContext(new Tone.Context());
}
export function createTone(tones: NotePack[]) {
  Tone.getTransport().stop();
  const synth = new Tone.PolySynth(Tone.Synth).toDestination();
  const now = Tone.now();
  const ctx = Tone.getContext();
  tones.forEach((note, i) => {
    if (note.note.length !== 2) {
      return;
    }
    const time = now + i * 0.25;
    synth.triggerAttackRelease(note.note, "8n", time);

    ctx.setTimeout(() => {
      note.element.classList.add("played");
    }, time - ctx.now());
  });
  synth.triggerRelease(
    tones.map(({ note }) => note),
    now + tones.length,
  );
}
