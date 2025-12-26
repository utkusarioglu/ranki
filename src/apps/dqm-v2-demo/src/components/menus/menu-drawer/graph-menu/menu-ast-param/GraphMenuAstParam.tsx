import type { GraphDrawerAstParam } from "_stores/ui/ui.store.types.mjs";
import { type FC } from "react";
import { DrawerTitleRow } from "_views/drawer-title-row/DrawerTitleRow";
import { GraphMenuAstPart } from "../ast-part/AstPart";
import { GraphMenuSourcePart } from "../source-part/SourcePart";
import { GraphMenuParamSemanticPart } from "../param-semantic-part/ParamSemanticPart";
import { GraphMenuAstParamPart } from "../ast-param-part/AstParamPart";

interface GraphMenuAstParamProps {
  data: GraphDrawerAstParam;
}

export const GraphMenuAstParam: FC<GraphMenuAstParamProps> = ({ data }) => {
  const d = data.sanitizedDqmNode;

  return (
    <>
      <DrawerTitleRow>AstParam Node</DrawerTitleRow>
      <GraphMenuSourcePart node={d} />
      <GraphMenuParamSemanticPart param={d} />
      <GraphMenuAstPart ast={d} />
      <GraphMenuAstParamPart param={d} />
    </>
  );
};
