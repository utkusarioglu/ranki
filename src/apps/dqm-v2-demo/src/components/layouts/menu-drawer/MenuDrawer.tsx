import { useUiStore } from "_stores/ui/ui.store.mts";
import { Scroller } from "_views/scroller/Scroller";
import { Drawer } from "antd";
import { type FC } from "react";
import style from "./MenuDrawer.module.css";
import { MenuDrawerSwitch } from "_menus/dqm-input-options/MenuDrawerSwitch";

export const MenuDrawer: FC = ({}) => {
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
