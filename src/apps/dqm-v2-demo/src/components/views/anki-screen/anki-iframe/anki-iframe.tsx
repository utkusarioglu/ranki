import { type FC } from "react";

import type { AnkiDesktopIFrameProps } from "./anki-iframe.types.mts";

import style from "./AnkiIFrame.module.css";
import { iFrameOnLoad } from "./on-load/on-load.mts";

export const FETCH_OVERRIDE = Symbol("fetcher");

/**
 * @dev
 * #1 FIX this is a stop-gap measure. a better solution for all inputs that
 * don't demand a reload would be much more useful
 */
export const AnkiIFrame: FC<AnkiDesktopIFrameProps> = ({
  srcDoc,
  ...onLoadVars
}) => {
  return (
    <iframe
      // #1
      className={style.container}
      onLoad={iFrameOnLoad(onLoadVars)}
      srcDoc={srcDoc}
    />
  );
};
