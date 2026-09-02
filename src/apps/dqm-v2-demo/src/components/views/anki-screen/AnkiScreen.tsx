import { type FC } from "react";

import { AnkiIFrame } from "./anki-iframe/anki-iframe";
import style from "./AnkiScreen.module.css";
import { getSizing } from "./utils/get-sizing.mts";
import { useDocumentCleaner, useRankiFiles } from "./hooks/hooks.mts";
import type { AnkiScreenProps } from "./AnkiScreen.types.mts";

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
