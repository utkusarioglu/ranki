import { Drawer } from "antd";
import { TitleBarNarrow } from "../title-bar/TitleBar";
import { useUiStore } from "../../stores/ui/ui.store.mts";
// import { HighLevelTabs } from "../tab-manager/Controls";
import style from "./NarrowDrawer.module.css";
import { TabManager } from "../tab-manager/TabManager";

export const NarrowDrawer = () => {
  const ui = useUiStore();
  return (
    <Drawer
      className={style.container}
      title={<TitleBarNarrow />}
      placement="left"
      closable={false}
      onClose={() => ui.setMenuOpen(false)}
      open={ui.isMenuOpen}
    >
      <TabManager />
      {/* <HighLevelTabs /> */}
    </Drawer>
  );
};
