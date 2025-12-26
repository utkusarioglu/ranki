import { type FC } from "react";
import { DrawerTitleRow } from "_views/drawer-title-row/DrawerTitleRow";
import { GraphMenuCpsParamPart } from "../../parts/cps-param-part/CpsParamPart";
import type { GraphDrawerCpsParam } from "_stores/ui/ui.store.types.mjs";
import { GraphMenuParamSemanticPart } from "../../parts/param-semantic-part/ParamSemanticPart";

interface GraphMenuCpsParamProps {
  data: GraphDrawerCpsParam;
}

export const GraphMenuCpsParam: FC<GraphMenuCpsParamProps> = ({ data }) => {
  const d = data.sanitizedDqmNode;

  return (
    <>
      <DrawerTitleRow>CpsParam Node</DrawerTitleRow>
      <GraphMenuParamSemanticPart param={d} />
      <GraphMenuCpsParamPart param={d} />
    </>
  );
};
