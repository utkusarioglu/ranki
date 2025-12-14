import { useUiStore } from "_stores/ui/ui.store.mts";
import { type TemplateDrawerModeOpen } from "_stores/ui/ui.store.types.mts";
import { Scroller } from "_views/scroller/Scroller";
import { Drawer } from "antd";
import { type FC } from "react";
import style from "./MenuDrawer.module.css";
import { ArrangementTemplates } from "./templates/arrangement-template/ArrangementTemplates";
import { SingleTemplates } from "./templates/single-template/SingleTemplates";

export const MenuDrawer = () => {
  const ui = useUiStore();

  return (
    <Drawer
      className={style.container}
      placement="left"
      closable={false}
      size={ui.menuWidth}
      mask={false}
      // maskClosable
      styles={{
        wrapper: {
          boxShadow: "none",
        },
      }}
      onClose={() => ui.setTemplateDrawerState(null)}
      open={ui.templateDrawerState !== null}
    >
      {ui.templateDrawerState === null ? null : (
        <Scroller direction="vertical">
          <MenuDrawerSwitch mode={ui.templateDrawerState} />
        </Scroller>
      )}
    </Drawer>
  );
};

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
