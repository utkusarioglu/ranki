import type { RankiFiles } from "_views/anki-screen/AnkiScreen.types.mjs";
import type { RankiIframeMessage } from "_views/anki-screen/utils/send-changes.mjs";

export type OnMessageCallback = (
  doc: HTMLDocument,
  qa: Element,
  files: RankiFiles,
) => (me: RankiIframeMessageEvent) => void;

type RankiIframeMessageEvent = MessageEvent<RankiIframeMessage>;
