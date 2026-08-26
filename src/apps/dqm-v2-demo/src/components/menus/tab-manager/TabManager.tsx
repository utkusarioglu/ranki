import { AnkiAndroidRenderSettings } from "_menus/anki-android-render-settings/AnkiAndroidRenderSettings";
import { AnkiWinRenderSettings } from "_menus/anki-win-render-settings/AnkiWinRenderSettings";
import { DqmConfigOptions } from "_menus/dqm-config-options/DqmConfigOptions";
import { DqmPluginsOptions } from "_menus/dqm-plugins-options/DqmPluginsOptions";
import { GraphOptions } from "_menus/graph-options/GraphOptions";
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
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Tabs, theme } from "antd";
import {
  type FC,
  type PropsWithChildren,
  type ReactNode,
  useEffect,
} from "react";

import { AstSanitizerOptions } from "../ast-sanitizer-options/AstSanitizerOptions";
import { DqmInputOptions } from "../dqm-input-options/DqmInputOptions";

interface ActivatorProps {
  route?: string;
}

type Level = {
  childLevels?: Level[];
  icon?: ReactNode;
  key: string;
  label: string;
  route?: string;
  TabChild?: ReactNode;
};

interface TabManagerProps {
  current: number;
  levels: Level[];
}

const NotYet = () => {
  return <p>Not yet implemented</p>;
};

const levels: Level[] = [
  {
    childLevels: [
      {
        icon: <FormOutlined />,
        key: "inputs",
        label: "Inputs",
        TabChild: <DqmInputOptions />,
      },
      {
        icon: <SettingOutlined />,
        key: "config",
        label: "Config",
        TabChild: <DqmConfigOptions />,
      },
      {
        icon: <InboxOutlined />,
        key: "plugins",
        label: "Plugins",
        TabChild: <DqmPluginsOptions />,
      },
    ],
    icon: <FormOutlined />,
    key: "dqm",
    label: "Dqm",
  },
  {
    childLevels: [
      {
        childLevels: [
          {
            key: "anki-win",
            label: "Anki Win",
            route: "/view/render/anki/windows",
            TabChild: <AnkiWinRenderSettings />,
          },
          {
            key: "anki-android",
            label: "Ankidroid",
            route: "/view/render/anki/android",
            TabChild: <AnkiAndroidRenderSettings />,
          },
          {
            key: "blog",
            label: "Blog",
            route: "/view/render/blog",
            TabChild: <NotYet />,
          },
        ],
        // TabChild: <RenderSettings />,
        // route: "/view/render/document",
        icon: <FundProjectionScreenOutlined />,
        key: "render",
        label: "Render",
      },
      {
        icon: <ShareAltOutlined />,
        key: "graph",
        label: "Graph",
        route: "/view/graph",
        TabChild: <GraphOptions />,
      },
      {
        childLevels: [
          {
            key: "ast",
            label: "Ast",
            route: "/view/nodes/ast",
            TabChild: <AstSanitizerOptions />,
          },
          {
            key: "cpx",
            label: "Cpx",
            route: "/view/nodes/cpx",
            TabChild: <NotYet />,
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
        icon: <BoxPlotOutlined />,
        key: "nodes",
        label: "Node",
      },
    ],
    icon: <FileTextOutlined />,
    key: "view",
    label: "View",
  },

  {
    icon: <BookOutlined />,
    key: "registry",
    label: "Registry",
    TabChild: <NotYet />,
  },
];

const Activator: FC<PropsWithChildren<ActivatorProps>> = ({
  children,
  route,
}) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (route) {
      navigate({ to: route });
    }
  }, []);

  return <>{children}</>;
};

const TabLevel: FC<TabManagerProps> = ({ current, levels }) => {
  let defaultKey = "1";
  const currSlice = useLocation().pathname.split("/").slice(1);
  const curr = currSlice[current];
  if (current > 0) {
    defaultKey = curr;
  }
  const { token } = theme.useToken();

  const prepared = levels.map((l) => ({
    children: l.childLevels ? (
      <TabLevel current={current + 1} levels={l.childLevels} />
    ) : (
      <Activator route={l.route}>{l.TabChild}</Activator>
    ),
    icon: l.icon,
    key: l.key,
    label: l.label,
  }));

  return (
    <Tabs
      defaultActiveKey={defaultKey}
      destroyOnHidden={true}
      items={prepared}
      tabBarStyle={{
        marginBottom: 0,
        paddingInline: token.padding,
      }}
    />
  );
};

export const TabManager = () => <TabLevel current={0} levels={levels} />;
