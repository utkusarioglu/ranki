import { Tabs, type TabsProps, theme } from "antd";
import {
  FileTextOutlined,
  FormOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { ViewOptions } from "../view-options/ViewOptions";
import { DqmInputOptions } from "../dqm-input-options/DqmInputOptions";
import { TitleBarWide } from "../title-bar/TitleBar";
import { Scroller } from "../scroller/Scroller";

const level0: TabsProps["items"] = [
  {
    key: "1",
    label: "Dqm",
    children: <DqmInputOptions />,
    icon: <FormOutlined />,
  },
  {
    key: "2",
    label: "View",
    children: <ViewOptions />,
    icon: <FileTextOutlined />,
  },
  {
    key: "3",
    label: "Plugins",
    children: "Content of Tab Pane 3",
    icon: <WalletOutlined />,
  },
];

export const WideMenu = () => {
  return (
    <Scroller direction="vertical">
      <TitleBarWide />
      <HighLevelTabs />
    </Scroller>
  );
};

export const HighLevelTabs = () => {
  const { token } = theme.useToken();
  return (
    <Tabs
      tabBarStyle={{
        paddingInline: token.padding,
        marginBottom: 0,
      }}
      defaultActiveKey="1"
      items={level0}
      indicator={{ size: (origin) => origin - 20 }}
    />
  );
};
