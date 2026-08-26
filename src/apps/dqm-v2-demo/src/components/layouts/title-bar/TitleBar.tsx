import type { FC } from "react";

import { useUiStore } from "_stores/ui/ui.store.mts";
import { AppTitle } from "_views/app-title/AppTitle";
import {
  DoubleLeftOutlined,
  InfoCircleOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "antd";

import { TitleRow } from "../../views/title-row/TitleRow";

export const TitleBarWide = () => {
  const ui = useUiStore();
  const navigate = useNavigate();
  return (
    <TitleRow isAbsolute={!ui.isMenuOpen}>
      {ui.isMenuOpen ? null : (
        <>
          <Button onClick={() => ui.setMenuOpen(true)}>
            <MenuOutlined />
          </Button>
        </>
      )}
      <AppTitle />
      <div>
        <Button onClick={() => navigate({ to: "/info" })} variant="filled">
          <InfoCircleOutlined />
        </Button>
        {ui.isMenuOpen ? (
          <Button onClick={() => ui.setMenuOpen(false)}>
            <DoubleLeftOutlined />
          </Button>
        ) : null}
      </div>
    </TitleRow>
  );
};
interface TitleBarNarrowProps {
  isAbsolute: boolean;
}

export const TitleBarNarrow: FC<TitleBarNarrowProps> = ({ isAbsolute }) => {
  const ui = useUiStore();
  return (
    <TitleRow isAbsolute={isAbsolute}>
      <Button onClick={() => ui.setMenuOpen(!ui.isMenuOpen)}>
        <MenuOutlined />
      </Button>
      <AppTitle />
      <div>
        <Button variant="filled">
          <InfoCircleOutlined />
        </Button>
      </div>
    </TitleRow>
  );
};
