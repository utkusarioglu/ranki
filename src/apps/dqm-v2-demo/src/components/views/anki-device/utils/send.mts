import type {
  AnkiDistStore,
  FetchOverrideRecord,
} from "_stores/anki-dist/anki.store.types.mjs";
import type { DqmStore } from "_stores/dqm/dqm.store.types.mjs";
import type { RefObject } from "react";

import type { RankiIframeMessage } from "./send.types.mts";

export class Send {
  public static changes(
    win: AnkiDistStore,
    dqm: DqmStore,
    ref: RefObject<HTMLIFrameElement | null>,
  ) {
    if (!ref.current) return;

    const cWIn = ref.current.contentWindow;
    if (!cWIn) return;

    const message: RankiIframeMessage = {
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
      type: "ranki-update",
    };

    cWIn.postMessage(message);
  }

  public static fetch(cWin: null | Window, fetchOverride: FetchOverrideRecord) {
    if (!cWin) return;

    const message: RankiIframeMessage = {
      fetchOverride,
      type: "ranki-fetch",
    };

    cWin.postMessage(message);
  }
}
