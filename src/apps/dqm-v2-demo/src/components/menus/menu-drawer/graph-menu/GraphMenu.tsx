import type { GraphDrawerModeOpen } from "_stores/ui/ui.store.types.mjs";
import type { FC } from "react";
import { assertNever } from "_assertions";
import { GraphMenuRawParam } from "./menu-raw-param/GraphMenuRawParam";
import { GraphMenuAst } from "./menu-ast/GraphMenuAst";
import { GraphMenuCpx } from "./menu-cpx/GraphMenuCpx";
import { GraphMenuCps } from "./menu-cps/GraphMenuCps";
import { GraphMenuParam } from "./menu-param/GraphMenuParam";

interface GraphMenuProps {
  mode: GraphDrawerModeOpen;
}

export const GraphMenu: FC<GraphMenuProps> = ({ mode }) => {
  switch (mode.data.type) {
    case "ast":
      return <GraphMenuAst data={mode.data} />;
    case "rawParam":
      return <GraphMenuRawParam data={mode.data} />;
    case "param":
      return <GraphMenuParam data={mode.data} />;
    case "cpx":
      return <GraphMenuCpx data={mode.data} />;
    case "cps":
      return <GraphMenuCps data={mode.data} />;

    default:
      assertNever({
        why: "All possibilities of `mode` should have been depleted",
        details: { mode },
      });
  }
};
