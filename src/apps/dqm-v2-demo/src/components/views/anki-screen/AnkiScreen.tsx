import { type FC } from "react";

import type { AnkiScreenProps } from "./AnkiScreen.types.mts";

import { AnkiIFrame } from "./anki-iframe/anki-iframe";
import style from "./AnkiScreen.module.css";
import { useDocumentCleaner, useRankiFiles } from "./hooks/hooks.mts";
import { getSizing } from "./utils/get-sizing.mts";

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
          onFetch={(original) => (url) => {
            const urlString = url.toString();
            if (["8080", "file-batch"].some((v) => urlString.includes(v))) {
              onEvent({ log: `Fetch override: ${urlString}` });
              return Promise.resolve(
                new Response(JSON.stringify({}), {
                  headers: {
                    "Content-Type": "application/json",
                  },
                  status: 200,
                }),
              );
            } else {
              return original(url);
            }
          }}
          onLoad={onLoad}
          ref={ref}
          srcDoc={srcDoc}
        />
        {Bottom}
      </div>
    </div>
  );
};
