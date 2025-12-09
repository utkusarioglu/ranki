import { Tabs, theme } from "antd";
import {
  BoxPlotOutlined,
  FileTextOutlined,
  FormOutlined,
  FundProjectionScreenOutlined,
  InboxOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { ViewOptions } from "../view-options/ViewOptions";
import { DqmInputOptions } from "../dqm-input-options/DqmInputOptions";
import { NodeOptions } from "../node-options/NodeOptions";
import { AstSanitizerOptions } from "../ast-sanitizer-options/AstSanitizerOptions";
import { type FC, type PropsWithChildren, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { RenderSettings } from "../render-settings/RenderSettings";

type Level = {
  key: string;
  label: string;
  icon?: ReactNode;
  route?: string;
  childLevels?: Level[];
  TabChild?: ReactNode;
};

interface TabManagerProps {
  levels: Level[];
}

interface ActivatorProps {
  route?: string;
}

const NotYet = () => {
  return <p>Not yet implemented</p>;
};

const levels: Level[] = [
  {
    key: "1",
    label: "Dqm",
    TabChild: <DqmInputOptions />,
    icon: <FormOutlined />,
  },
  {
    key: "2",
    label: "View",
    TabChild: <ViewOptions />,
    icon: <FileTextOutlined />,
    childLevels: [
      {
        key: "1",
        label: "Render",
        TabChild: <RenderSettings />,
        route: "/render/document",
        icon: <FundProjectionScreenOutlined />,
      },
      {
        key: "2",
        label: "Graph",
        TabChild: <NotYet />,
        icon: <ShareAltOutlined />,
      },
      {
        key: "3",
        label: "Node",
        TabChild: <NodeOptions />,
        icon: <BoxPlotOutlined />,
        childLevels: [
          {
            key: "1",
            label: "Ast",
            TabChild: <AstSanitizerOptions />,
            route: "/nodes/ast",
          },
          {
            key: "2",
            label: "Cpx",
            TabChild: <NotYet />,
            route: "/nodes/cpx",
          },
          {
            key: "3",
            label: "Cps",
            TabChild: <NotYet />,
          },
          {
            key: "4",
            label: "Val",
            TabChild: <NotYet />,
          },
          {
            key: "5",
            label: "Trn",
            TabChild: <NotYet />,
          },
          {
            key: "6",
            label: "Ren",
            TabChild: <NotYet />,
          },
        ],
      },
    ],
  },
  {
    key: "3",
    label: "Plugins",
    TabChild: <NotYet />,
    icon: <InboxOutlined />,
  },
];

const Activator: FC<PropsWithChildren<ActivatorProps>> = ({
  route,
  children,
}) => {
  const navigate = useNavigate();
  // !FIX this renders the route twice on first run (understandably)
  if (route) {
    navigate({ to: route });
  }

  return <>{children}</>;
};

export const TabLevel: FC<TabManagerProps> = ({ levels }) => {
  const defaultKey = "1";
  const { token } = theme.useToken();

  const prepared = levels.map((l) => ({
    key: l.key,
    label: l.label,
    icon: l.icon,
    children: l.childLevels ? (
      <TabLevel levels={l.childLevels} />
    ) : (
      <Activator route={l.route}>{l.TabChild}</Activator>
    ),
  }));

  return (
    <Tabs
      tabBarStyle={{
        paddingInline: token.padding,
        marginBottom: 0,
      }}
      destroyOnHidden={true}
      defaultActiveKey={defaultKey}
      items={prepared}
    />
  );
};

export const TabManager = () => <TabLevel levels={levels} />;
