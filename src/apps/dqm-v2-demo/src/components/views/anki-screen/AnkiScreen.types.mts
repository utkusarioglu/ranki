import type {
  RankiAppVariant,
  RankiIframeEvent,
} from "_stores/anki-dist/anki.store.types.mjs";
import type { ReactNode } from "react";
import type { AnkiDesktopIFrameProps } from "./anki-iframe/anki-iframe.types.mts";

export interface RankiElements {
  css: HTMLStyleElement[];
  fragment: DocumentFragment;
  jss: HTMLScriptElement[];
}

export interface RankiFiles {
  css: Record<string, string>;
  epoch: number;
  html: Record<string, string>;
  js: Record<string, string>;
}

export interface AnkiScreenProps extends Omit<
  AnkiDesktopIFrameProps,
  "files" | "onFetch" | "srcDoc"
> {
  appVariant: RankiAppVariant;
  aspect: number;
  Bottom: ReactNode;
  deviceClassName: string;

  /**
   * Css matchers for elements that you would like to comment out in the `src`
   * document. this allows keeping these elements in the html while removing
   * their influence.
   *
   * it is useful for commenting out elements with src and href attributes that
   * keep making network requests that can never be fulfilled.
   */
  srcFilters?: string[];
  src: string;
  onLoad: () => void;
  reservedWidth: number;
  scale: number;
  Top: ReactNode;
  onEvent: (event: RankiIframeEvent) => void;
}
