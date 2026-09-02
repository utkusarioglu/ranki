import type { ReactEventHandler } from "react";
import type { AnkiDesktopIFrameProps } from "../anki-iframe.types.mts";

type OnLoadProps = Omit<AnkiDesktopIFrameProps, "srcDoc">;

export type IFrameOnLoadCb = (
  o: OnLoadProps,
) => ReactEventHandler<HTMLIFrameElement>;
