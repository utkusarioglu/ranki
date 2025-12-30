import type { GraphDrawerCps } from "_stores/ui/ui.store.types.mjs";
import { type FC } from "react";
import { DrawerTitleRow } from "_views/drawer-title-row/DrawerTitleRow";
import { GraphMenuCpsPart } from "../../parts/cps-part/CpsPart";
import { CpsParamChannelsPart } from "../../parts/cps-param-channels-part/CpsParamChannelsPart";
import { CpsDqmConfigPart } from "../../parts/cps-dqm-config-part/CpsDqmConfigPart";
import { CpsComponentConfig } from "../../parts/cps-component-config-part/CpsComponentConfigPart";

interface GraphMenuCpsProps {
  data: GraphDrawerCps;
}

export const GraphMenuCps: FC<GraphMenuCpsProps> = ({ data }) => {
  const d = data.sanitizedDqmNode;

  return (
    <>
      <DrawerTitleRow>Cps Node</DrawerTitleRow>
      <GraphMenuCpsPart cps={d} />
      <CpsParamChannelsPart cps={d} />
      <CpsComponentConfig cps={d} />
      <CpsDqmConfigPart cps={d} />
    </>
  );
};
