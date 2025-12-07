import { Splitter } from "antd";
import { useUiStore } from "../../stores/ui/ui.store.mts";
import style from "./WideLayout.module.css";
import { Scroller } from "../scroller/Scroller";
import { TitleBarWide } from "../title-bar/TitleBar";
import { ContentContainer } from "../content-container/ContentContainer";
import { WideMenu } from "../controls/Controls";

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
          min={250}
          max="50%"
        >
          <WideMenu />
        </Splitter.Panel>
      ) : null}
      <Splitter.Panel className={style.panel}>
        <Scroller direction="vertical">
          {ui.isMenuOpen ? null : <TitleBarWide />}
          <ContentContainer />
        </Scroller>
      </Splitter.Panel>
    </Splitter>
  );
};
