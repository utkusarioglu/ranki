import type { GraphDrawerAst } from "_stores/ui/ui.store.types.mjs";

import {
  DrawerTitleCode,
  DrawerTitleRow,
} from "_views/drawer-title-row/DrawerTitleRow";
import { type FC } from "react";

import { GraphMenuAstPart } from "../../parts/ast-part/AstPart";
import { GraphMenuSourcePart } from "../../parts/source-part/SourcePart";

interface GraphMenuAstProps {
  data: GraphDrawerAst;
}

export const GraphMenuAst: FC<GraphMenuAstProps> = ({ data }) => {
  const d = data.sanitizedDqmNode;

  return (
    <>
      <DrawerTitleRow>
        <DrawerTitleCode>Ast</DrawerTitleCode> Node
      </DrawerTitleRow>
      <GraphMenuSourcePart node={d} />
      <GraphMenuAstPart ast={d} />
    </>
  );
};
