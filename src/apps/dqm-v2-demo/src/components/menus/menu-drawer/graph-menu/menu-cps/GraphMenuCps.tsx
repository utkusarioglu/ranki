import type { GraphDrawerCps } from "_stores/ui/ui.store.types.mjs";
import { type FC } from "react";
import { DrawerTitleRow } from "_views/drawer-title-row/DrawerTitleRow";
import { GraphMenuCpsPart } from "../cps-part/CpsPart";

interface GraphMenuCpsProps {
  data: GraphDrawerCps;
}

export const GraphMenuCps: FC<GraphMenuCpsProps> = ({ data }) => {
  const d = data.dqmNode;

  return (
    <>
      <DrawerTitleRow>Properties</DrawerTitleRow>
      <GraphMenuCpsPart cps={d} />
    </>
  );
};
