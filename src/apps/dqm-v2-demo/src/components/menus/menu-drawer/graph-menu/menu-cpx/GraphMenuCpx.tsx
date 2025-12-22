import type { GraphDrawerCpx } from "_stores/ui/ui.store.types.mjs";
import { type FC } from "react";
import { DrawerTitleRow } from "_views/drawer-title-row/DrawerTitleRow";
import { GraphMenuCpxPart } from "../cpx-part/CpxPart";

interface GraphMenuCpxProps {
  data: GraphDrawerCpx;
}

export const GraphMenuCpx: FC<GraphMenuCpxProps> = ({ data }) => {
  const d = data.dqmNode;

  return (
    <>
      <DrawerTitleRow>Cpx Node</DrawerTitleRow>
      <GraphMenuCpxPart cpx={d} />
    </>
  );
};
