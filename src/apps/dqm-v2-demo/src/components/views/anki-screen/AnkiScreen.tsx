import type {
  RankiAppVariant,
  RankiIframeEvent,
} from "_stores/anki-dist/anki.store.types.mjs";

import { useEffect, useState, type FC, type ReactNode } from "react";

import { type AnkiDesktopIFrameProps, AnkiIFrame } from "./anki-iframe";
import style from "./AnkiIFrame.module.css";
import { getSizing, useRankiFiles } from "./utils";

export type RankiElements = {
  css: HTMLStyleElement[];
  fragment: DocumentFragment;
  jss: HTMLScriptElement[];
};

export type RankiFiles = {
  css: Record<string, string>;
  epoch: number;
  html: Record<string, string>;
  js: Record<string, string>;
};

interface AnkiScreenProps extends Omit<
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

const PADDING = 16;

function useDocumentCleaner(src: string, filters?: string[]) {
  const [srcClean, setSrcClean] = useState<string | null>(null);
  useEffect(() => {
    fetch(src)
      .then((v) => v.text())
      .then((str) => {
        if (!filters || !filters.length) {
          setSrcClean(str);
          return;
        }

        const doc = new DOMParser().parseFromString(str, "text/html");
        filters.forEach((t) => {
          const matches = doc.querySelectorAll(t);
          for (const m of matches) {
            m.replaceWith(document.createComment(m.outerHTML));
          }
        });
        const clean = doc.documentElement.outerHTML;
        setSrcClean(clean);
      });
  }, []);

  return srcClean;
}

export const AnkiScreen: FC<AnkiScreenProps> = ({
  appVariant,
  aspect,
  Bottom,
  deviceClassName,
  onLoad,
  ref,
  reservedWidth,
  scale,
  src,
  srcFilters,
  Top,
  onEvent,
}) => {
  const files = useRankiFiles(appVariant);
  const srcDoc = useDocumentCleaner(src, srcFilters);

  if (files.epoch === 0 || srcDoc === null) {
    return (
      <div className={style.loading}>
        <span>Loading...</span>
      </div>
    );
  }

  const sizing = getSizing(PADDING, aspect, scale, reservedWidth, 0);

  return (
    <div className={style.screen}>
      <div
        className={[style.device, deviceClassName].join(" ")}
        style={{
          position: "absolute",
          transform: `scale(${1 / scale})`,
          ...sizing,
          borderWidth: scale,
        }}
      >
        {Top}
        <AnkiIFrame
          files={files}
          key={appVariant}
          onLoad={onLoad}
          ref={ref}
          srcDoc={srcDoc}
          onFetch={(original) => (url) => {
            const urlString = url.toString();
            if (["8080", "file-batch"].some((v) => urlString.includes(v))) {
              onEvent({ log: `Fetch override: ${urlString}` });
              return Promise.resolve(
                new Response(JSON.stringify({}), {
                  status: 200,
                  headers: {
                    "Content-Type": "application/json",
                  },
                }),
              );
            } else {
              return original(url);
            }
          }}
        />
        {Bottom}
      </div>
    </div>
  );
};
