import { useUiStore } from "_stores/ui/ui.store.mts";
import { App, ConfigProvider, Layout, theme } from "antd";
import style from "./Application.module.css";
import { WideLayout } from "_layouts/wide-layout/WideLayout";
import { NarrowLayout } from "_layouts/narrow-layout/NarrowLayout";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "_views/error-fallback/ErrorFallback";

function Application() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorBgBase: "#151515", // global background
            colorBgContainer: "#202020", // card/component background
            borderRadius: 0,
            colorPrimary: "#E6AE07",
            colorTextSecondary: "#404040",
            colorBorder: "transparent",
          },
          components: {
            Input: {
              colorBgContainer: "var(--color-bg-sample)", // card/component background
              fontFamily: "monospace",
            },
            Button: {
              // colorBorder: "var(--ant-color-bg-base)",
              colorBgContainer: "#252525",
              colorBorderDisabled: "transparent",
            },
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
