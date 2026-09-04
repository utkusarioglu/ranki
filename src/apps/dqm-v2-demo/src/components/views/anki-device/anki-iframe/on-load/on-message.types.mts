import type { RankiFiles } from "_views/anki-device/screen/AnkiScreen.types.mjs";
import type { RankiIframeMessage } from "_views/anki-device/utils/send.types.mjs";

export type OnMessageCallback = (
  win: Window,
  doc: HTMLDocument,
  qa: Element,
  files: RankiFiles,
) => (me: RankiIframeMessageEvent) => void;

type RankiIframeMessageEvent = MessageEvent<RankiIframeMessage>;
