import { type FC, useEffect } from "react";

import { AnkiIFrame } from "../anki-iframe/anki-iframe";
import style from "./AnkiScreen.module.css";
import { useDocumentCleaner, useRankiFiles } from "../hooks/hooks.mts";
import { computeSizing } from "../utils/get-sizing.mts";
import { Send } from "../utils/send.mts";
import type { AnkiScreenProps } from "./AnkiScreen.types.mts";

const PADDING = 16;

export const AnkiScreen: FC<AnkiScreenProps> = ({
  appVariant,
  aspect,
  Bottom,
  deviceClassName,
  fetchOverride,
  onEvent,
  onLoad,
  ref,
  reservedWidth,
  scale,
  src,
  srcFilters,
  Top,
}) => {
  const files = useRankiFiles(appVariant);
  const srcDoc = useDocumentCleaner(src, srcFilters);

  useEffect(() => {
    const onMessage = (e: MessageEvent<string>) => {
      onEvent({ log: e.data });
    };

    window.top?.addEventListener("message", onMessage);
    return () => window.top?.removeEventListener("message", onMessage);
  }, [onEvent]);

  useEffect(() => {
    if (ref.current && ref.current.contentWindow) {
      Send.fetch(ref.current.contentWindow, fetchOverride);
    }
  }, [ref, fetchOverride]);

  if (files.epoch === 0 || srcDoc === null) {
    return (
      <div className={style.loading}>
        <span>Loading...</span>
      </div>
    );
  }

  const sizing = computeSizing(PADDING, aspect, scale, reservedWidth, 0);

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
          fetchOverride={fetchOverride}
          files={files}
          key={appVariant}
          onLoad={onLoad}
          ref={ref}
          srcDoc={srcDoc}
        />
        {Bottom}
      </div>
    </div>
  );
};
