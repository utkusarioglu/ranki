import { type FC } from "react";
import { DrawerTitleRow } from "_views/drawer-title-row/DrawerTitleRow";
// import { GraphMenuAstPart } from "../ast-part/AstPart";
import { GraphMenuCpsParamPart } from "../cps-param-part/CpsParamPart";
import type { GraphDrawerCpsParam } from "_stores/ui/ui.store.types.mjs";
// import { GraphMenuDefaultParamPart } from "../default-param-part/DefaultParamPart";
import { GraphMenuParamSemanticPart } from "../param-semantic-part/ParamSemanticPart";

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
      {/* <GraphMenuDefaultParamPart param={d} /> */}
      {/* <GraphMenuAstPart ast={d} /> */}
    </>
  );
};
