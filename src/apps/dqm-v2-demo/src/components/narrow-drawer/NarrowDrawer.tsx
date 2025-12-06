import { Drawer } from "antd";
import { TitleBarNarrow } from "../title-bar/TitleBar";
import { useUiStore } from "../../stores/ui/ui.store.mts";
import { HighLevelTabs } from "../controls/Controls";
import style from "./NarrowDrawer.module.css";

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
      <HighLevelTabs />
    </Drawer>
  );
};
