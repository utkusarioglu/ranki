import type { IDqmRendererClientPreferences } from "@dqm/package-dqm-api-v2";
import { assertExists } from "_assertions";
import type {
  AnkiDistStore,
  RankiContentType,
} from "_stores/anki-dist/anki.store.types.mjs";
import type { DqmStore } from "_stores/dqm/dqm.store.types.mjs";
import type { RefObject } from "react";

export interface RankiIframeMessage {
  type: "ranki-update";
  ranki: {
    contentType: RankiContentType;
    fields: {
      a: string;
      b: string;
      card: string;
      deck: string;
      face: string;
      flag: string;
      tags: string;
      type: string;
    };
    pref: IDqmRendererClientPreferences;
  };
}

export function sendChanges(
  win: AnkiDistStore,
  dqm: DqmStore,
  ref: RefObject<HTMLIFrameElement | null>,
) {
  if (!ref.current) return;

  const cWIn = ref.current.contentWindow;
  assertExists(cWIn, { why: "Iframe content window is required" });

  const message: RankiIframeMessage = {
    type: "ranki-update",
    ranki: {
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
      pref: {
        scheme: win.colorScheme,
      },
    },
  };

  cWIn.postMessage(message);
}
