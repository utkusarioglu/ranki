import type { GraphDrawerModeOpen } from "_stores/ui/ui.store.types.mjs";
import type { FC } from "react";
import { assertNever } from "_assertions";
import { GraphMenuAstParam } from "./menu-ast-param/GraphMenuAstParam";
import { GraphMenuAst } from "./menu-ast/GraphMenuAst";
import { GraphMenuCpx } from "./menu-cpx/GraphMenuCpx";
import { GraphMenuCps } from "./menu-cps/GraphMenuCps";
import { GraphMenuCpsParam } from "./menu-cps-param/GraphMenuCpsParam";

interface GraphMenuProps {
  mode: GraphDrawerModeOpen;
}

export const GraphMenu: FC<GraphMenuProps> = ({ mode }) => {
  switch (mode.data.type) {
    case "Ast":
      return <GraphMenuAst data={mode.data} />;
    case "AstParam":
      return <GraphMenuAstParam data={mode.data} />;
    case "CpsParam":
      return <GraphMenuCpsParam data={mode.data} />;
    case "Cpx":
      return <GraphMenuCpx data={mode.data} />;
    case "Cps":
      return <GraphMenuCps data={mode.data} />;

    default:
      assertNever({
        why: "All possibilities of `mode` should have been depleted",
        details: { mode },
      });
  }
};
