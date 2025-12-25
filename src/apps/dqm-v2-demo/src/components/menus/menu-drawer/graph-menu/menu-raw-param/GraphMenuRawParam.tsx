import type { GraphDrawerRawParam } from "_stores/ui/ui.store.types.mjs";
import { type FC } from "react";
import { DrawerTitleRow } from "_views/drawer-title-row/DrawerTitleRow";
import { GraphMenuAstPart } from "../ast-part/AstPart";
import { GraphMenuSourcePart } from "../source-part/SourcePart";
import { GraphMenuParamPart } from "../param-part/ParamPart";

interface GraphMenuRawParamProps {
  data: GraphDrawerRawParam;
}

export const GraphMenuRawParam: FC<GraphMenuRawParamProps> = ({ data }) => {
  const d = data.sanitizedDqmNode;

  return (
    <>
      <DrawerTitleRow>Raw Param Node</DrawerTitleRow>
      <GraphMenuSourcePart node={d} />
      <GraphMenuParamPart param={d} />
      <GraphMenuAstPart ast={d} />
    </>
  );
};
