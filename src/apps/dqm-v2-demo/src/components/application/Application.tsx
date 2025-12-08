import { useUiStore } from "../../stores/ui/ui.store.mts";
import { App, ConfigProvider, Layout, theme } from "antd";
import style from "./Application.module.css";
import { useEffect, useRef } from "react";
import yaml from "yaml";
import { useCodeStore } from "../../stores/code/code.store.mts";
import {
  ClockCircleOutlined,
  LoadingOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { WideLayout } from "../wide-layout/WideLayout";
import { NarrowLayout } from "../narrow-layout/NarrowLayout";
import { AppNonIdeal } from "../app-non-ideal/AppNonIdeal";
import { TIMEOUT_MSEC, TEMPLATE_FILES } from "./Application.constants.mts";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../error-fallback/ErrorFallback";

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
          },
        }}
      >
        <App className={style.cover}>
          <Layout className={style.cover}>
            <Layout.Content>
              <ApplicationStateFork />
            </Layout.Content>
          </Layout>
        </App>
      </ConfigProvider>
    </ErrorBoundary>
  );
}

function useResourceFetch() {
  const ui = useUiStore();
  const code = useCodeStore();

  const running = useRef(false);
  const resolved = useRef(false);

  useEffect(() => {
    if (running.current) {
      return;
    }
    running.current = true;

    const timeout = new Promise<string>((_, j) =>
      setTimeout(() => j("timeout"), TIMEOUT_MSEC),
    );

    const templates = Promise.all(
      TEMPLATE_FILES.map((filename) => fetchYaml(filename)),
    )
      .then((v) => code.setTemplates(v))
      .catch(() => {
        if (!resolved.current) {
          throw "error";
        }
      });

    const arrangements = fetchYaml("/arrangements.yaml")
      .then((a) => code.setArrangements(a))
      .catch(() => {
        if (!resolved.current) {
          throw "error";
        }
      });

    Promise.race([timeout, templates, arrangements])
      .then(() => {
        ui.setAppState("loaded");
      })
      .catch((state) => ui.setAppState(state));

    return () => {
      resolved.current = true;
    };
  }, []);

  return { appState: ui.appState };
}

const fetchYaml = async (filename: string) =>
  fetch(filename)
    .then((d) => d.text())
    .then((t) => yaml.parse(t));

const ApplicationStateFork = () => {
  const { appState } = useResourceFetch();

  switch (appState) {
    case "init":
    case "loading":
      return <AppNonIdeal Icon={LoadingOutlined} text="Loading..." />;
    case "loaded":
      return <AppLoaded />;
    case "timeout":
      return <AppNonIdeal Icon={ClockCircleOutlined} text="Timeout" />;
    case "error":
      return <AppNonIdeal Icon={WarningOutlined} text="Error" />;
  }
};

const AppLoaded = () => {
  const ui = useUiStore();
  return <>{ui.isNarrow ? <NarrowLayout /> : <WideLayout />}</>;
};

export default Application;
