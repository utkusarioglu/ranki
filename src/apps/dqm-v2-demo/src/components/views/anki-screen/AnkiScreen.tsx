import { type FC, type ReactNode } from "react";
import style from "./AnkiIFrame.module.css";
import { getSizing, useRankiFiles } from "./utils";
import { AnkiIFrame, type AnkiDesktopIFrameProps } from "./anki-iframe";
import type { RankiAppVariant } from "_stores/anki-dist/anki.store.types.mjs";

export type RankiElements = {
  fragment: DocumentFragment;
  jss: HTMLScriptElement[];
  css: HTMLStyleElement[];
};

export type RankiFiles = {
  epoch: number;
  html: Record<string, string>;
  css: Record<string, string>;
  js: Record<string, string>;
};

interface AnkiScreenProps extends Omit<AnkiDesktopIFrameProps, "files"> {
  Top: ReactNode;
  Bottom: ReactNode;
  deviceClassName: string;
  appVariant: RankiAppVariant;

  aspect: number;
  scale: number;
  reservedWidth: number;
  onLoad: () => void;
}

const PADDING = 16;

export const AnkiScreen: FC<AnkiScreenProps> = ({
  ref,
  Top,
  Bottom,
  deviceClassName,
  src,
  aspect,
  scale,
  reservedWidth,
  appVariant,
  onLoad,
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
          key={appVariant}
          ref={ref}
          src={src}
          files={files}
          onLoad={onLoad}
        />
        {Bottom}
      </div>
    </div>
  );
};
