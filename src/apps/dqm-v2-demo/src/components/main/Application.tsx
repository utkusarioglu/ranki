import { NarrowLayout } from "_layouts/narrow-layout/NarrowLayout";
import { WideLayout } from "_layouts/wide-layout/WideLayout";
import { useUiStore } from "_stores/ui/ui.store.mts";
import { ErrorFallback } from "_views/error-fallback/ErrorFallback";
import { App, ConfigProvider, Layout, theme } from "antd";
import { ErrorBoundary } from "react-error-boundary";

import style from "./Application.module.css";

function Application() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          components: {
            Button: {
              // colorBorder: "var(--ant-color-bg-base)",
              colorBgContainer: "#252525",
              colorBorderDisabled: "transparent",
            },
            Input: {
              colorBgContainer: "var(--color-bg-sample)", // card/component background
              fontFamily: "monospace",
            },
          },
          token: {
            borderRadius: 0,
            colorBgBase: "#151515", // global background
            colorBgContainer: "#202020", // card/component background
            colorBorder: "transparent",
            colorPrimary: "#E6AE07",
            colorTextSecondary: "#404040",
          },
        }}
      >
        <App className={style.cover}>
          <Layout className={style.cover}>
            <Layout.Content>
              <AppLoaded />
            </Layout.Content>
          </Layout>
        </App>
      </ConfigProvider>
    </ErrorBoundary>
  );
}

const AppLoaded = () => {
  const ui = useUiStore();
  return <>{ui.isNarrow ? <NarrowLayout /> : <WideLayout />}</>;
};

export default Application;
