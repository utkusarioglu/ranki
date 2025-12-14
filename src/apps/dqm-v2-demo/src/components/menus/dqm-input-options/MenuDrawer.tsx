import { type TemplateDrawerModeOpen } from "_stores/ui/ui.store.types.mts";
import { type FC } from "react";
import { ArrangementTemplates } from "./templates/arrangement-template/ArrangementTemplates";
import { SingleTemplates } from "./templates/single-template/SingleTemplates";

export type MenuDrawerSwitchProps = {
  mode: TemplateDrawerModeOpen;
};

export const MenuDrawerSwitch: FC<MenuDrawerSwitchProps> = ({ mode }) => {
  switch (mode.type) {
    case "arrangement":
      return <ArrangementTemplates mode={mode} />;
    case "single":
      return <SingleTemplates mode={mode} />;
  }
};
