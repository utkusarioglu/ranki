import { NodeOptions } from "../node-options/NodeOptions";
import { Tabs, type TabsProps, theme } from "antd";
import { FileTextOutlined } from "@ant-design/icons";

const NotYet = () => {
  return <p>too early</p>;
};

const levelView: TabsProps["items"] = [
  {
    key: "1",
    label: "Render",
    children: <NotYet />,
    // icon: <FormOutlined />,
  },
  {
    key: "2",
    label: "Graph",
    children: <NotYet />,
    icon: <FileTextOutlined />,
  },
  {
    key: "3",
    label: "Node",
    children: <NodeOptions />,
    // icon: <WalletOutlined />,
  },
];

export const ViewOptions = () => {
  const { token } = theme.useToken();
  return (
    <Tabs
      tabBarStyle={{
        paddingInline: token.padding,
        marginBottom: 0,
      }}
      defaultActiveKey="1"
      items={levelView}
      indicator={{ size: (origin) => origin - 20 }}
    />
  );
};
