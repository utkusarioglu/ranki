import type { GraphViewStoreStateKey } from "_stores/graph-view/graph-view.store.types.mjs";
import type { FC } from "react";

import {
  graphViewStoreInitialState,
  useGraphViewStore,
} from "_stores/graph-view/graph-view.store.mjs";
import { Typography } from "antd";

import style from "./GraphOptions.module.css";
import { GraphOptItem } from "./item/GraphOptItem";

interface SectionProps {
  filter: (g: GraphViewStoreStateKey) => boolean;
  title: string;
}

const SECTIONS: SectionProps[] = [
  {
    filter: (v) =>
      [
        "ast_extension",
        "ast_head",
        "astParam",
        "cps",
        "cpsParam",
        "cpx",
        "edge",
        "label",
        "node",
        "param",
      ].includes(v),
    title: "Basic",
  },
  {
    filter: (v) => v.split("_").includes("node"),
    title: "Node",
  },
  {
    filter: (v) => v.split("_").includes("edge"),
    title: "Edge",
  },
  {
    filter: (v) => v.split("_").includes("label"),
    title: "Label",
  },
  {
    filter: (v) => v.split("_").includes("ast"),
    title: "Ast",
  },
  {
    filter: (v) => v.split("_").includes("cpx"),
    title: "Cpx",
  },
  {
    filter: (v) => v.split("_").includes("cps"),
    title: "Cps",
  },
  {
    filter: (v) => v.split("_").includes("cpsParam"),
    title: "CpsParam",
  },
  {
    filter: (v) => v.split("_").includes("astParam"),
    title: "RawParam",
  },
];

export const GraphOptions = () => {
  return (
    <div className={style.container}>
      {SECTIONS.map(({ filter, title }) => (
        <GraphOptSection filter={filter} key={title} title={title} />
      ))}
    </div>
  );
};

type GraphOptSectionProps = SectionProps;

const GraphOptSection: FC<GraphOptSectionProps> = ({ filter, title }) => {
  const graph = useGraphViewStore();

  const keys = (
    Object.keys(graphViewStoreInitialState) as GraphViewStoreStateKey[]
  ).filter(filter);

  return (
    <div>
      <Typography.Title level={4}>{title}</Typography.Title>
      {keys.map((k) => (
        <GraphOptItem
          k={k}
          key={k}
          setVisibility={graph.setVisibility.bind(graph)}
          value={graph[k]}
        />
      ))}
    </div>
  );
};
