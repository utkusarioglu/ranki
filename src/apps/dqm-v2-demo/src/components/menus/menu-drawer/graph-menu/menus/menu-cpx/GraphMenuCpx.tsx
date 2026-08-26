import type { GraphDrawerCpx } from "_stores/ui/ui.store.types.mjs";

import { DrawerTitleRow } from "_views/drawer-title-row/DrawerTitleRow";
import { type FC } from "react";

import { GraphMenuCpxPart } from "../../parts/cpx-part/CpxPart";

interface GraphMenuCpxProps {
  data: GraphDrawerCpx;
}

export const GraphMenuCpx: FC<GraphMenuCpxProps> = ({ data }) => {
  const d = data.sanitizedDqmNode;

  return (
    <>
      <DrawerTitleRow>Cpx Node</DrawerTitleRow>
      <GraphMenuCpxPart cpx={d} />
    </>
  );
};
