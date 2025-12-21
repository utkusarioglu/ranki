import type { GraphDrawerAst } from "_stores/ui/ui.store.types.mjs";
import { type FC } from "react";
import { DrawerTitleRow } from "_views/drawer-title-row/DrawerTitleRow";
import { GraphMenuAstPart } from "../ast-part/AstPart";
import { GraphMenuSourcePart } from "../source-part/SourcePart";

interface GraphMenuAstProps {
  data: GraphDrawerAst;
}

export const GraphMenuAst: FC<GraphMenuAstProps> = ({ data }) => {
  const d = data.dqmNode;

  return (
    <>
      <DrawerTitleRow>Properties</DrawerTitleRow>
      <GraphMenuSourcePart node={d} />
      <GraphMenuAstPart ast={d} />
    </>
  );
};
