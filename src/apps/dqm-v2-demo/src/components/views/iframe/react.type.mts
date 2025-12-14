import type { PropsWithChildren, ReactElement } from "react";

// ANKI
export type SyncFC<P = {}> = (
  props: PropsWithChildren<P>,
) => ReactElement | null;
