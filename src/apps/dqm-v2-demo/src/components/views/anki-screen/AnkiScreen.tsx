import { type FC } from "react";

import type { AnkiScreenProps } from "./AnkiScreen.types.mts";

import { AnkiIFrame } from "./anki-iframe/anki-iframe";
import style from "./AnkiScreen.module.css";
import { useDocumentCleaner, useRankiFiles } from "./hooks/hooks.mts";
import { getSizing } from "./utils/get-sizing.mts";
import { Send } from "./utils/send.mts";

const PADDING = 16;

export const AnkiScreen: FC<AnkiScreenProps> = ({
  appVariant,
  aspect,
  Bottom,
  deviceClassName,
  onEvent,
  onLoad,
  ref,
  reservedWidth,
  scale,
  src,
  srcFilters,
  Top,
  fetchOverride,
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
  Send.fetch(ref, fetchOverride);

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
          fetchOverride={fetchOverride}
          ref={ref}
          srcDoc={srcDoc}
        />
        {Bottom}
      </div>
    </div>
  );
};
