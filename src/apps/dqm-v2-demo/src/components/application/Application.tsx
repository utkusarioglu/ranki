import { useUiStore } from "../../stores/ui/ui.store.mts";
import { App, ConfigProvider, Layout, Splitter, theme } from "antd";
import { WideMenu } from "../controls/Controls";
import style from "./Application.module.css";
import { TitleBarNarrow, TitleBarWide } from "../title-bar/TitleBar";
import { NarrowDrawer } from "../narrow-drawer/NarrowDrawer";
import { ContentContainer } from "../content-container/ContentContainer";
import { Scroller } from "../scroller/Scroller";

function Application() {
  const ui = useUiStore();

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgBase: "#151515", // global background
          colorBgContainer: "#202020", // card/component background
          borderRadius: 0,
          colorPrimary: "#E6AE07",
          colorTextSecondary: "#404040",
        },
      }}
    >
      <App className={style.cover}>
        <Layout className={style.cover}>
          <Layout.Content>
            {ui.isNarrow ? <NarrowLayout /> : <WideLayout />}
          </Layout.Content>
        </Layout>
      </App>
    </ConfigProvider>
  );
}

const NarrowLayout = () => {
  return (
    <Scroller direction="vertical">
      <div className={style.mobile}>
        <TitleBarNarrow />
        <ContentContainer />
        <NarrowDrawer />
      </div>
    </Scroller>
  );
};

const WideLayout = () => {
  const ui = useUiStore();
  return (
    <Splitter className={style.splitter} draggerIcon={null}>
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

export default Application;
