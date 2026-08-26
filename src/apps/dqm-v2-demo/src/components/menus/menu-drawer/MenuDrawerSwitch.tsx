import { GraphMenu } from "_menus/menu-drawer/graph-menu/GraphMenu";
import { type MenuDrawerModeOpen } from "_stores/ui/ui.store.types.mts";
import { type FC } from "react";

import { ArrangementTemplates } from "./templates/arrangement-template/ArrangementTemplates";
import { SingleTemplates } from "./templates/single-template/SingleTemplates";

export type MenuDrawerSwitchProps = {
  mode: MenuDrawerModeOpen;
};

export const MenuDrawerSwitch: FC<MenuDrawerSwitchProps> = ({ mode }) => {
  switch (mode.type) {
    case "arrangement":
      return <ArrangementTemplates mode={mode} />;
    case "graph":
      return <GraphMenu mode={mode} />;
    case "single":
      return <SingleTemplates mode={mode} />;
  }
};
