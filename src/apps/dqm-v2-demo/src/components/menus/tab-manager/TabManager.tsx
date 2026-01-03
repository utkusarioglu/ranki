import { Tabs, theme } from "antd";
import {
  BookOutlined,
  BoxPlotOutlined,
  FileTextOutlined,
  FormOutlined,
  FundProjectionScreenOutlined,
  InboxOutlined,
  SettingOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { DqmInputOptions } from "../dqm-input-options/DqmInputOptions";
import { AstSanitizerOptions } from "../ast-sanitizer-options/AstSanitizerOptions";
import { type FC, type PropsWithChildren, type ReactNode } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { RenderSettings } from "../render-settings/RenderSettings";
import { DqmPluginsOptions } from "_menus/dqm-plugins-options/DqmPluginsOptions";
import { DqmConfigOptions } from "_menus/dqm-config-options/DqmConfigOptions";
import { GraphOptions } from "_menus/graph-options/GraphOptions";

type Level = {
  key: string;
  label: string;
  icon?: ReactNode;
  route?: string;
  childLevels?: Level[];
  TabChild?: ReactNode;
};

interface TabManagerProps {
  current: number;
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
    key: "dqm",
    label: "Dqm",
    icon: <FormOutlined />,
    childLevels: [
      {
        key: "inputs",
        label: "Inputs",
        TabChild: <DqmInputOptions />,
        icon: <FormOutlined />,
      },
      {
        key: "config",
        label: "Config",
        TabChild: <DqmConfigOptions />,
        icon: <SettingOutlined />,
      },
      {
        key: "plugins",
        label: "Plugins",
        TabChild: <DqmPluginsOptions />,
        icon: <InboxOutlined />,
      },
    ],
  },
  {
    key: "view",
    label: "View",
    icon: <FileTextOutlined />,
    childLevels: [
      {
        key: "render",
        label: "Render",
        TabChild: <RenderSettings />,
        route: "/view/render/document",
        icon: <FundProjectionScreenOutlined />,
      },
      {
        key: "graph",
        label: "Graph",
        TabChild: <GraphOptions />,
        route: "/view/graph",
        icon: <ShareAltOutlined />,
      },
      {
        key: "nodes",
        label: "Node",
        icon: <BoxPlotOutlined />,
        childLevels: [
          {
            key: "ast",
            label: "Ast",
            TabChild: <AstSanitizerOptions />,
            route: "/view/nodes/ast",
          },
          {
            key: "cpx",
            label: "Cpx",
            TabChild: <NotYet />,
            route: "/view/nodes/cpx",
          },
          {
            key: "cps",
            label: "Cps",
            TabChild: <NotYet />,
          },
          {
            key: "val",
            label: "Val",
            TabChild: <NotYet />,
          },
          {
            key: "trn",
            label: "Trn",
            TabChild: <NotYet />,
          },
          {
            key: "ren",
            label: "Ren",
            TabChild: <NotYet />,
          },
        ],
      },
    ],
  },

  {
    key: "registry",
    label: "Registry",
    icon: <BookOutlined />,
    TabChild: <NotYet />,
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

export const TabLevel: FC<TabManagerProps> = ({ levels, current }) => {
  let defaultKey = "1";
  const currSlice = useLocation().pathname.split("/").slice(1);
  const curr = currSlice[current];
  if (current > 0) {
    defaultKey = curr;
  }
  const { token } = theme.useToken();

  const prepared = levels.map((l) => ({
    key: l.key,
    label: l.label,
    icon: l.icon,
    children: l.childLevels ? (
      <TabLevel levels={l.childLevels} current={current + 1} />
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

export const TabManager = () => <TabLevel levels={levels} current={0} />;
