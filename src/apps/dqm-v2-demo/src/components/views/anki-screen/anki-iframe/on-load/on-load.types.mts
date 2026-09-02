import type { ReactEventHandler } from "react";

import type { AnkiDesktopIFrameProps } from "../anki-iframe.types.mts";

export type IFrameOnLoadCb = (
  o: OnLoadProps,
) => ReactEventHandler<HTMLIFrameElement>;

type OnLoadProps = Omit<AnkiDesktopIFrameProps, "srcDoc">;
