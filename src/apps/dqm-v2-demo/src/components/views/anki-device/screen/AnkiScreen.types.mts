import type {
  FetchOverrideRecord,
  RankiAppVariant,
} from "_stores/anki-dist/anki.store.types.mjs";
import type { ReactNode } from "react";

import type { AnkiDesktopIFrameProps } from "../anki-iframe/anki-iframe.types.mts";
import type { RankiOnEvent } from "_stores/anki-dist/anki-telemetry.mjs";

export interface AnkiScreenProps extends Omit<
  AnkiDesktopIFrameProps,
  "files" | "onFetch" | "srcDoc"
> {
  appVariant: RankiAppVariant;
  aspect: number;
  Bottom: ReactNode;
  deviceClassName: string;

  /**
   * Sets whether the custom fetch function defined inside the iframe will allow telemetry endpoints do one of the following:
   * - Allow communication with the server
   * - Auto throw on each request without allowing server comm
   * - Auto respond with 200 on each request without allowing server comm
   */
  fetchOverride: FetchOverrideRecord;
  onEvent: RankiOnEvent;
  onLoad: () => void;
  reservedWidth: number;
  scale: number;
  src: string;
  /**
   * Css matchers for elements that you would like to comment out in the `src`
   * document. this allows keeping these elements in the html while removing
   * their influence.
   *
   * it is useful for commenting out elements with src and href attributes that
   * keep making network requests that can never be fulfilled.
   */
  srcFilters?: string[];

  Top: ReactNode;
}

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
