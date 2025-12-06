import { Button, Flex, Typography, theme } from "antd";
import {
  DoubleLeftOutlined,
  InfoCircleOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useUiStore } from "../../stores/ui/ui.store.mts";
import { AppTitle } from "../app-title/AppTitle";

export const TitleBarWide = () => {
  const ui = useUiStore();
  const { token } = theme.useToken();
  return (
    <Flex
      style={{ marginInline: token.padding }}
      justify="space-between"
      align="center"
    >
      {ui.isMenuOpen ? null : (
        <>
          <Button onClick={() => ui.setMenuOpen(true)}>
            <MenuOutlined />
          </Button>
        </>
      )}
      <Typography.Title style={{ margin: 0 }} level={3}>
        Dqm<span style={{ color: token.colorTextSecondary }}>v2</span>
      </Typography.Title>
      <div style={{ paddingBlock: token.padding }}>
        <Button variant="filled">
          <InfoCircleOutlined />
        </Button>
        {ui.isMenuOpen ? (
          <Button onClick={() => ui.setMenuOpen(false)}>
            <DoubleLeftOutlined />
          </Button>
        ) : null}
      </div>
    </Flex>
  );
};

export const TitleBarNarrow = () => {
  const ui = useUiStore();
  const { token } = theme.useToken();
  return (
    <Flex
      style={{ marginInline: token.padding }}
      justify="space-between"
      align="center"
    >
      <Button onClick={() => ui.setMenuOpen(!ui.isMenuOpen)}>
        <MenuOutlined />
      </Button>
      <AppTitle />
      <div style={{ paddingBlock: token.padding }}>
        <Button variant="filled">
          <InfoCircleOutlined />
        </Button>
      </div>
    </Flex>
  );
};
