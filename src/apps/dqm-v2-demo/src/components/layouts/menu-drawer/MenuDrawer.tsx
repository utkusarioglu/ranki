import { MenuDrawerSwitch } from "_menus/menu-drawer/MenuDrawerSwitch";
import { useUiStore } from "_stores/ui/ui.store.mts";
import { Scroller } from "_views/scroller/Scroller";
import { Drawer } from "antd";
import { type FC } from "react";

import style from "./MenuDrawer.module.css";

export const MenuDrawer: FC = ({}) => {
  const ui = useUiStore();

  return (
    <Drawer
      className={style.container}
      closable={false}
      mask={false}
      onClose={() => ui.setTemplateDrawerState(null)}
      open={ui.templateDrawerState !== null}
      placement="left"
      size={ui.menuWidth}
      // maskClosable
      styles={{
        wrapper: {
          boxShadow: "none",
        },
      }}
    >
      {ui.templateDrawerState === null ? null : (
        <Scroller direction="vertical">
          <MenuDrawerSwitch mode={ui.templateDrawerState} />
        </Scroller>
      )}
    </Drawer>
  );
};
