import { useGraphViewStore } from "_stores/graph-view/graph-view.store.mjs";
import { BlockySwitch } from "_views/blocky-switch/BlockySwitch";

export const GraphOptions = () => {
  const graph = useGraphViewStore();

  return (
    <div>
      <BlockySwitch
        onChange={(e) => graph.setAst(e)}
        title="Ast"
        value={graph.ast}
      />
      <BlockySwitch
        onChange={(e) => graph.setCpx(e)}
        title="Cpx"
        value={graph.cpx}
      />
      <BlockySwitch
        onChange={(e) => graph.setCps(e)}
        title="Cps"
        value={graph.cps}
      />
      <BlockySwitch
        onChange={(e) => graph.setParam(e)}
        title="Param"
        value={graph.param}
      />
      <BlockySwitch
        onChange={(e) => graph.setRawParam(e)}
        title="RawParam"
        value={graph.rawParam}
      />
      <BlockySwitch
        onChange={(e) => graph.setEdgeLabels(e)}
        title="EdgeLabels"
        value={graph.edgeLabels}
      />
    </div>
  );
};
