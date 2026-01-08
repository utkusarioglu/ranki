import type { IDqmRenderPluginRenderer as R } from "@dqm/package-dqm-api-v2";
import * as Tone from "tone";
import css from "./payload.css?raw";

function killTone() {
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

interface NotePack {
  element: HTMLSpanElement;
  note: string;
}

function createTone(tones: NotePack[]) {
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

export const payload: R = {
  chain: ["audio", "audio-context", "tone-js", "payload", "block"],
  kind: "leaf",
  sync: ({ trn }) => {
    const element = document.createElement("div");
    element.classList.add("audio-block");

    killTone();

    const noteTexts: string[] = trn.source
      .split("\n")
      .map((v) => v.trim())
      .join(" ")
      .split(" ");

    const notes = noteTexts.map((note) => {
      const n = document.createElement("span");
      n.classList.add("note");
      n.innerText = note;
      element.appendChild(n);
      return {
        note,
        element: n,
      };
    });

    return {
      element,
      css: [
        {
          id: "audio-block-section",
          css,
        },
      ],
      afterMount: [
        async () => {
          console.log("calling after mount");
          try {
            createTone(notes);
          } catch {
            Tone.getTransport().stop();
          }
        },
      ],
      beforeUnmount: [
        async () => {
          console.log("stopping during unmount");
          Tone.getTransport().stop();
          console.log("stopping during unmount2");
        },
      ],
    };
  },
};
