import { useUiStore } from "_stores/ui/ui.store.mts";
import { Scroller } from "_views/scroller/Scroller";
import { Drawer } from "antd";
import { type FC } from "react";
import style from "./MenuDrawer.module.css";
import { MenuDrawerSwitch } from "_menus/menu-drawer/MenuDrawerSwitch";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "_views/error-fallback/ErrorFallback";

export const MenuDrawer: FC = ({}) => {
  const ui = useUiStore();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Drawer
        className={style.container}
        placement="left"
        closable={false}
        size={ui.menuWidth}
        mask={false}
        // maskClosable
        styles={{
          wrapper: {
            boxShadow: "none",
          },
        }}
        onClose={() => ui.setTemplateDrawerState(null)}
        open={ui.templateDrawerState !== null}
      >
        {ui.templateDrawerState === null ? null : (
          <Scroller direction="vertical">
            <MenuDrawerSwitch mode={ui.templateDrawerState} />
          </Scroller>
        )}
      </Drawer>
    </ErrorBoundary>
  );
};
