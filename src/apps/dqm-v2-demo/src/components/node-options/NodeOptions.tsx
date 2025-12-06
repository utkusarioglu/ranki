import { AstSanitizerOptions } from "../ast-sanitizer-options/AstSanitizerOptions";
import { Tabs, type TabsProps, theme } from "antd";

const NotYet = () => {
  return <p>too early</p>;
};

const levelViewNode: TabsProps["items"] = [
  {
    key: "1",
    label: "Ast",
    children: <AstSanitizerOptions />,
  },
  {
    key: "2",
    label: "Cpx",
    children: <NotYet />,
  },
  {
    key: "3",
    label: "Cps",
    children: <NotYet />,
  },
  {
    key: "4",
    label: "Validation",
    children: <NotYet />,
  },
  {
    key: "5",
    label: "Transform",
    children: <NotYet />,
  },
  {
    key: "6",
    label: "Render",
    children: <NotYet />,
  },
];

export const NodeOptions = () => {
  const { token } = theme.useToken();
  return (
    <Tabs
      tabBarStyle={{
        paddingInline: token.padding,
        marginBottom: 0,
      }}
      defaultActiveKey="1"
      items={levelViewNode}
      indicator={{ size: (origin) => origin - 20 }}
    />
  );
};
