import type { IDqmRendererClientPreferences } from "@dqm/package-dqm-api-v2";
import type { AnkiDistStore } from "_stores/anki-dist/anki.store.types.mjs";
import type { DqmStore } from "_stores/dqm/dqm.store.types.mjs";
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
        deck: win.deck,
        tags: win.tags,
        flag: win.flag,
        face: win.face,
        type: win.cardType,
        card: win.card,
      },
      pref,
    };
    ref.current.contentWindow!.postMessage({
      type: "ranki-update",
      ranki,
    });
  }
}
