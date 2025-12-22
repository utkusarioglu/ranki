import { useGraphViewStore } from "_stores/graph-view/graph-view.store.mjs";
import { BlockySwitch } from "_views/blocky-switch/BlockySwitch";

export const GraphOptions = () => {
  const graph = useGraphViewStore();

  return (
    <div>
      <BlockySwitch onChange={(e) => graph.setAst(e)} title="Ast" />
      <BlockySwitch onChange={(e) => graph.setCpx(e)} title="Cpx" />
      <BlockySwitch onChange={(e) => graph.setCps(e)} title="Cps" />
      <BlockySwitch onChange={(e) => graph.setParam(e)} title="Param" />
      <BlockySwitch onChange={(e) => graph.setRawParam(e)} title="RawParam" />
      <BlockySwitch
        onChange={(e) => graph.setEdgeLabels(e)}
        title="EdgeLabels"
      />
    </div>
  );
};
