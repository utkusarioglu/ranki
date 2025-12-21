import type { GraphDrawerParam } from "_stores/ui/ui.store.types.mjs";
import { type FC } from "react";
import { DrawerTitleRow } from "_views/drawer-title-row/DrawerTitleRow";
import { GraphMenuAstPart } from "../ast-part/AstPart";
import { GraphMenuSourcePart } from "../source-part/SourcePart";
import { GraphMenuParamPart } from "../param-part/ParamPart";

interface GraphMenuParamProps {
  data: GraphDrawerParam;
}

export const GraphMenuParam: FC<GraphMenuParamProps> = ({ data }) => {
  const d = data.dqmNode;

  return (
    <>
      <DrawerTitleRow>Properties</DrawerTitleRow>
      <GraphMenuSourcePart node={d} />
      <GraphMenuParamPart param={d} />
      <GraphMenuAstPart ast={d} />
    </>
  );
};
