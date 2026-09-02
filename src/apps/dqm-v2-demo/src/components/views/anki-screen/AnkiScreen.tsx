import type {
  RankiAppVariant,
  RankiIframeEvent,
} from "_stores/anki-dist/anki.store.types.mjs";

import { type FC, type ReactNode } from "react";

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
  "files" | "onFetch"
> {
  appVariant: RankiAppVariant;
  aspect: number;
  Bottom: ReactNode;
  deviceClassName: string;

  onLoad: () => void;
  reservedWidth: number;
  scale: number;
  Top: ReactNode;
  onEvent: (event: RankiIframeEvent) => void;
}

const PADDING = 16;

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
  Top,
  onEvent,
}) => {
  const files = useRankiFiles(appVariant);

  if (files.epoch === 0) {
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
          src={src}
          onFetch={(original) => (url) => {
            const urlString = url.toString();
            if (["8080", "file-batch"].some((v) => urlString.includes(v))) {
              onEvent({ log: `Fetch override: ${urlString}` });
              return Promise.resolve(
                new Response(JSON.stringify({ hello: "world" }), {
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
