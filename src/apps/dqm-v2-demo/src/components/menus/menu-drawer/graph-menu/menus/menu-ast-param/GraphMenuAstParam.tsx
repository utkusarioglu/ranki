import type { GraphDrawerAstParam } from "_stores/ui/ui.store.types.mjs";
import { type FC } from "react";
import { DrawerTitleRow } from "_views/drawer-title-row/DrawerTitleRow";
import { GraphMenuAstPart } from "../../parts/ast-part/AstPart";
import { GraphMenuSourcePart } from "../../parts/source-part/SourcePart";
import { GraphMenuAstParamPart } from "../../parts/ast-param-part/AstParamPart";
import { GraphMenuAstParamSemanticPart } from "../../parts/ast-param-semantic-part/AstParamSemanticPart";

interface GraphMenuAstParamProps {
  data: GraphDrawerAstParam;
}

export const GraphMenuAstParam: FC<GraphMenuAstParamProps> = ({ data }) => {
  const d = data.sanitizedDqmNode;

  return (
    <>
      <DrawerTitleRow>AstParam Node</DrawerTitleRow>
      <GraphMenuSourcePart node={d} />
      <GraphMenuAstParamSemanticPart param={d} />
      <GraphMenuAstParamPart param={d} />
      <GraphMenuAstPart ast={d} />
    </>
  );
};
