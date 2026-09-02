import type { RankiFiles } from "_views/anki-screen/AnkiScreen.types.mjs";
import type { RankiIframeMessage } from "_views/anki-screen/utils/send-changes.mjs";

type RankiIframeMessageEvent = MessageEvent<RankiIframeMessage>;

export type OnMessageCallback = (
  doc: HTMLDocument,
  qa: Element,
  files: RankiFiles,
) => (me: RankiIframeMessageEvent) => void;
