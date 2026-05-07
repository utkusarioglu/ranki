import type { IDqmRenderPluginRenderer as R } from "@dqm/package-dqm-api-v2";
// import * as Tone from "tone";
import css from "./payload.css?raw";

export const payload: R = {
  chain: ["audio", "audio-context", "tone-js", "payload", "block"],
  kind: "leaf",
  sync: ({ ser }) => {
    const element = document.createElement("div");
    element.classList.add("audio-block");

    // killTone();

    const noteTexts: string[] = ser.source
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

          const tone = await import("./tone.mjs");
          tone.killTone();
          // import { killTone, createTone } from "./tone.mjs";
          try {
            tone.createTone(notes);
          } catch {
            tone.stopTone();
          }
        },
      ],
      beforeUnmount: [
        async () => {
          console.log("stopping during unmount");
          const tone = await import("./tone.mjs");
          tone.stopTone();

          console.log("stopping during unmount2");
        },
      ],
    };
  },
};
