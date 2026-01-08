import { Drawer } from "antd";
import { TitleBarNarrow } from "_layouts/title-bar/TitleBar";
import { useUiStore } from "_stores/ui/ui.store.mts";
import style from "./NarrowDrawer.module.css";
import { TabManager } from "_menus/tab-manager/TabManager";

export const NarrowDrawer = () => {
  const ui = useUiStore();
  return (
    <Drawer
      className={style.container}
      title={<TitleBarNarrow isAbsolute={false} />}
      placement="left"
      closable={false}
      onClose={() => ui.setMenuOpen(false)}
      open={ui.isMenuOpen}
    >
      <TabManager />
    </Drawer>
  );
};
