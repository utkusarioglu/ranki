import { type FC, type ReactNode } from "react";
import type {
  DqmParseInputStructured,
  IDqmRendererClientPreferences,
} from "@dqm/package-dqm-api-v2";
import style from "./AnkiIFrame.module.css";
import { getSizing, useRankiFiles } from "./utils";
import { AnkiIFrame, type AnkiDesktopIFrameProps } from "./anki-iframe";

export type CardElements = {
  fragment: DocumentFragment;
  html: string;
  jss: HTMLScriptElement[];
  css: HTMLStyleElement[];
};

export type RankiFiles = {
  epoch: number;
  html: Record<string, string>;
  css: Record<string, string>;
  js: Record<string, string>;
};

interface AnkiScreenProps
  extends Pick<
    AnkiDesktopIFrameProps,
    "inputs" | "src" | "pref" | "templateConfig" | "cardConfig"
  > {
  Top: ReactNode;
  Bottom: ReactNode;
  deviceClassName: string;

  aspect: number;
  scale: number;
  reservedWidth: number;
}

const PADDING = 16;

export const AnkiScreen: FC<AnkiScreenProps> = ({
  Top,
  Bottom,
  deviceClassName,
  src,
  aspect,
  scale,
  reservedWidth,
  inputs,
  pref,
  templateConfig,
  cardConfig,
}) => {
  const files = useRankiFiles([]);
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
          src={src}
          files={files}
          pref={pref}
          inputs={inputs}
          templateConfig={templateConfig}
          cardConfig={cardConfig}
        />
        {Bottom}
      </div>
    </div>
  );
};
