import { DisplayContainer } from "_layouts/display-container/ContentContainer";
import { MenuDrawer } from "_layouts/menu-drawer/MenuDrawer";
import { TitleBarWide } from "_layouts/title-bar/TitleBar";
import { TabManager } from "_menus/tab-manager/TabManager";
import { WIDE_LAYOUT_LEFT_MENU_WIDTH_MIN } from "_stores/ui/ui.store.constants.mts";
import { useUiStore } from "_stores/ui/ui.store.mts";
import { ErrorFallback } from "_views/error-fallback/ErrorFallback";
import { Scroller } from "_views/scroller/Scroller";
import { Splitter } from "antd";
import { ErrorBoundary } from "react-error-boundary";

import style from "./WideLayout.module.css";

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
          max="50%"
          min={WIDE_LAYOUT_LEFT_MENU_WIDTH_MIN}
        >
          <WideMenu />
        </Splitter.Panel>
      ) : null}
      <Splitter.Panel className={style.panel}>
        {ui.isMenuOpen ? null : <TitleBarWide />}
        <DisplayContainer />
      </Splitter.Panel>
    </Splitter>
  );
};

const WideMenu = () => {
  return (
    <Scroller direction="vertical">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <TitleBarWide />
        <TabManager />
        <MenuDrawer />
      </ErrorBoundary>
    </Scroller>
  );
};
