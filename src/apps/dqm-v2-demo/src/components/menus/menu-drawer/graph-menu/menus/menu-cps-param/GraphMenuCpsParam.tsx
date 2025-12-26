import { type FC } from "react";
import { DrawerTitleRow } from "_views/drawer-title-row/DrawerTitleRow";
import { GraphMenuCpsDefaultParamsPart } from "../../parts/cps-default-params-part/CpsDefaultParamsPart";
import type { GraphDrawerCpsParam } from "_stores/ui/ui.store.types.mjs";
import { GraphMenuParamSemanticPart } from "../../parts/param-semantic-part/ParamSemanticPart";
import { GraphMenuCpsParamCountsPart } from "../../parts/cps-param-counts-part/CpsParamCountsPart";
import { GraphMenuCpsMergedParamsPart } from "../../parts/cps-merged-params-part/CpsMergedParamsPart";
import { GraphMenuCpsAstParamsPart } from "../../parts/cps-ast-params-part/CpsAstParamsPart";

interface GraphMenuCpsParamProps {
  data: GraphDrawerCpsParam;
}

export const GraphMenuCpsParam: FC<GraphMenuCpsParamProps> = ({ data }) => {
  const d = data.sanitizedDqmNode;

  return (
    <>
      <DrawerTitleRow>CpsParam Node</DrawerTitleRow>
      <GraphMenuParamSemanticPart param={d} />
      <GraphMenuCpsParamCountsPart param={d} />
      <GraphMenuCpsMergedParamsPart param={d} />
      <GraphMenuCpsAstParamsPart param={d} />
      <GraphMenuCpsDefaultParamsPart param={d} />
    </>
  );
};
