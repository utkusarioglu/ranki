import {
  graphViewStoreInitialState,
  useGraphViewStore,
} from "_stores/graph-view/graph-view.store.mjs";
import type { GraphViewStoreStateKey } from "_stores/graph-view/graph-view.store.types.mjs";
import { Typography } from "antd";
import type { FC } from "react";
import style from "./GraphOptions.module.css";
import { GraphOptItem } from "./item/GraphOptItem";

interface SectionProps {
  title: string;
  filter: (g: GraphViewStoreStateKey) => boolean;
}

const SECTIONS: SectionProps[] = [
  {
    title: "Basic",
    filter: (v) =>
      [
        "node",
        "edge",
        "label",
        "ast",
        "cpx",
        "cps",
        "param",
        "astParam",
      ].includes(v),
  },
  {
    title: "Node",
    filter: (v) => v.split("_").includes("node"),
  },
  {
    title: "Edge",
    filter: (v) => v.split("_").includes("edge"),
  },
  {
    title: "Label",
    filter: (v) => v.split("_").includes("label"),
  },
  {
    title: "Ast",
    filter: (v) => v.split("_").includes("ast"),
  },
  {
    title: "Cpx",
    filter: (v) => v.split("_").includes("cpx"),
  },
  {
    title: "Cps",
    filter: (v) => v.split("_").includes("cps"),
  },
  {
    title: "Param",
    filter: (v) => v.split("_").includes("param"),
  },
  {
    title: "RawParam",
    filter: (v) => v.split("_").includes("astParam"),
  },
];

export const GraphOptions = () => {
  return (
    <div className={style.container}>
      {SECTIONS.map(({ title, filter }) => (
        <GraphOptSection key={title} title={title} filter={filter} />
      ))}
    </div>
  );
};

type GraphOptSectionProps = SectionProps;

const GraphOptSection: FC<GraphOptSectionProps> = ({ title, filter }) => {
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
          value={graph[k]}
          setVisibility={graph.setVisibility.bind(graph)}
          key={k}
        />
      ))}
    </div>
  );
};
