import { Button } from "antd";
import {
  DoubleLeftOutlined,
  InfoCircleOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useUiStore } from "_stores/ui/ui.store.mts";
import { AppTitle } from "_views/app-title/AppTitle";
import { TitleRow } from "../../views/title-row/TitleRow";
import { useNavigate } from "@tanstack/react-router";

export const TitleBarWide = () => {
  const ui = useUiStore();
  const navigate = useNavigate();
  return (
    <TitleRow>
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

export const TitleBarNarrow = () => {
  const ui = useUiStore();
  return (
    <TitleRow>
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
