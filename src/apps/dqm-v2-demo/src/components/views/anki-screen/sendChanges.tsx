import type { AnkiDistStore } from "_stores/anki-dist/anki.store.types.mjs";
import type { DqmStore } from "_stores/dqm/dqm.store.types.mjs";
import type { IDqmRendererClientPreferences } from "@dqm/package-dqm-api-v2";
import type { RefObject } from "react";

export function sendChanges(
  win: AnkiDistStore,
  dqm: DqmStore,
  ref: RefObject<HTMLIFrameElement | null>,
) {
  if (ref.current) {
    const pref: IDqmRendererClientPreferences = { scheme: win.colorScheme };
    const ranki = {
      contentType: win.contentType,
      fields: {
        a: dqm.inputs[0].dqm,
        b: dqm.inputs[1].dqm,
        card: win.card,
        deck: win.deck,
        face: win.face,
        flag: win.flag,
        tags: win.tags,
        type: win.cardType,
      },
      pref,
    };
    ref.current.contentWindow!.postMessage({
      ranki,
      type: "ranki-update",
    });
  }
}
