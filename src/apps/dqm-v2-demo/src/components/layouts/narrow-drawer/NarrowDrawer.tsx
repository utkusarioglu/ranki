import { TitleBarNarrow } from "_layouts/title-bar/TitleBar";
import { TabManager } from "_menus/tab-manager/TabManager";
import { useUiStore } from "_stores/ui/ui.store.mts";
import { Drawer } from "antd";

import style from "./NarrowDrawer.module.css";

export const NarrowDrawer = () => {
  const ui = useUiStore();
  return (
    <Drawer
      className={style.container}
      closable={false}
      onClose={() => ui.setMenuOpen(false)}
      open={ui.isMenuOpen}
      placement="left"
      title={<TitleBarNarrow isAbsolute={false} />}
    >
      <TabManager />
    </Drawer>
  );
};
