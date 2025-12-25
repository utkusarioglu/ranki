import { type FC } from "react";
import { DrawerTitleRow } from "_views/drawer-title-row/DrawerTitleRow";
import { GraphMenuAstPart } from "../ast-part/AstPart";
import { GraphMenuParamPart } from "../param-part/ParamPart";
import type { GraphDrawerParam } from "_stores/ui/ui.store.types.mjs";
import { GraphMenuDefaultParamPart } from "../default-param-part/DefaultParamPart";

interface GraphMenuParamProps {
  data: GraphDrawerParam;
}

export const GraphMenuParam: FC<GraphMenuParamProps> = ({ data }) => {
  const d = data.sanitizedDqmNode;

  return (
    <>
      <DrawerTitleRow>Param Node</DrawerTitleRow>
      <GraphMenuParamPart param={d} />
      <GraphMenuDefaultParamPart param={d} />
      <GraphMenuAstPart ast={d} />
    </>
  );
};
