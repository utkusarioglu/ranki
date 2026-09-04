import { type FC } from "react";

import type { AnkiDesktopIFrameProps } from "./anki-iframe.types.mts";

import style from "./AnkiIFrame.module.css";
import { iFrameOnLoad } from "./on-load/on-load.mts";

export const AnkiIFrame: FC<AnkiDesktopIFrameProps> = ({
  srcDoc,
  ...onLoadVars
}) => {
  return (
    <iframe
      className={style.container}
      onLoad={iFrameOnLoad(onLoadVars)}
      srcDoc={srcDoc}
    />
  );
};
