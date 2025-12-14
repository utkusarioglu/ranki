import { Splitter } from "antd";
import { useUiStore } from "_stores/ui/ui.store.mts";
import style from "./WideLayout.module.css";
import { Scroller } from "../views/scroller/Scroller";
import { TitleBarWide } from "../title-bar/TitleBar";
import { ContentContainer } from "../content/content-container/ContentContainer";
import { TabManager } from "../menu/tab-manager/TabManager";
import { WIDE_LAYOUT_LEFT_MENU_WIDTH_MIN } from "../../stores/ui/ui.store.constants.mts";

export const WideLayout = () => {
  const ui = useUiStore();
  return (
    <Splitter
      className={style.splitter}
      draggerIcon={null}
      onResizeEnd={(e) => ui.setMenuWidth(e[0])}
    >
      {ui.isMenuOpen ? (
        <Splitter.Panel
          className={style.panel}
          defaultSize={ui.menuWidth}
          min={WIDE_LAYOUT_LEFT_MENU_WIDTH_MIN}
          max="50%"
        >
          <WideMenu />
        </Splitter.Panel>
      ) : null}
      <Splitter.Panel className={style.panel}>
        {ui.isMenuOpen ? null : <TitleBarWide />}
        <ContentContainer />
      </Splitter.Panel>
    </Splitter>
  );
};

export const WideMenu = () => {
  return (
    <Scroller direction="vertical">
      <TitleBarWide />
      <TabManager />
    </Scroller>
  );
};
