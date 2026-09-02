import type { RefObject } from "react";
import type { RankiFiles } from "../AnkiScreen.types.mts";

export interface AnkiDesktopIFrameProps {
  files: RankiFiles;
  onLoad: () => void;
  ref: RefObject<HTMLIFrameElement | null>;

  /**
   * This isn't an url. this is the root html document string that shall be put
   * in the iframe element. Consumer needs to do its own fetch and prepare the
   * document string.
   */
  srcDoc: string;

  /**
   * Allows interfering with `window.fetch` calls made by the iframe. it's
   * useful for logging fetch calls, preventing them, or returning fake
   * responses for them.
   */
  onFetch?: (originalFetch: typeof window.fetch) => typeof window.fetch;
}
