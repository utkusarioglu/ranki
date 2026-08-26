import type { GraphDrawerModeOpen } from "_stores/ui/ui.store.types.mjs";
import type { FC } from "react";

import { assertNever } from "_assertions";

import { GraphMenuAstParam } from "./menus/menu-ast-param/GraphMenuAstParam";
import { GraphMenuAst } from "./menus/menu-ast/GraphMenuAst";
import { GraphMenuCpsParam } from "./menus/menu-cps-param/GraphMenuCpsParam";
import { GraphMenuCps } from "./menus/menu-cps/GraphMenuCps";
import { GraphMenuCpx } from "./menus/menu-cpx/GraphMenuCpx";

interface GraphMenuProps {
  mode: GraphDrawerModeOpen;
}

export const GraphMenu: FC<GraphMenuProps> = ({ mode }) => {
  switch (mode.data.type) {
    case "Ast":
      return <GraphMenuAst data={mode.data} />;
    case "AstParam":
      return <GraphMenuAstParam data={mode.data} />;
    case "Cps":
      return <GraphMenuCps data={mode.data} />;
    case "CpsParam":
      return <GraphMenuCpsParam data={mode.data} />;
    case "Cpx":
      return <GraphMenuCpx data={mode.data} />;

    default:
      assertNever({
        details: { mode },
        why: "All possibilities of `mode` should have been depleted",
      });
  }
};
