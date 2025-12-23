import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import Cytoscape, { type Core, type EventObject } from "cytoscape";
import fcose from "cytoscape-fcose";
// @ts-expect-error
import CytoscapeComponent from "react-cytoscapejs";
import { buildElements } from "./build-elements/build.mts";
import { theme } from "antd";
import { buildStyleSheet } from "./stylesheet/stylesheet.mts";
import { layout } from "./layout.mts";
import { useUiStore } from "_stores/ui/ui.store.mjs";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type FC,
  type RefObject,
} from "react";
import { onTapNode, onTapNothing } from "./events.mts";
import { useErrorBoundary } from "react-error-boundary";
import { useGraphViewStore } from "_stores/graph-view/graph-view.store.mjs";
import type { GraphViewStoreStateKey } from "_stores/graph-view/graph-view.store.types.mjs";
import { LOOKUP } from "./LOOKUP";
import type { Flattened } from "./build-elements/build.types";
import { assertExists } from "_assertions";

Cytoscape.use(fcose);

export const AstGraph = () => {
  const dqm = useDqmStore();
  const boundary = useErrorBoundary();

  if (dqm.parsed.state !== "success") {
    boundary.showBoundary(dqm.parsed.error);
    return null;
  }

  if (dqm.parsed.data.length < 1) {
    return <div>No theaters</div>;
  }

  const data = dqm.parsed.data;
  const elements = useMemo(() => buildElements(data[0].ast), [data[0].ast]);

  if (elements === null) {
    // TODO
    return <p>got null</p>;
  }

  return <AstGraphSuccess elements={elements} />;
};
interface AstGraphSuccessProps {
  elements: Flattened;
}

function useCyStateBind(
  cyRef: RefObject<Core | null>,
  elemType: GraphViewStoreStateKey,
) {
  const enabled = useGraphViewStore((s) => s[elemType]);
  useEffect(() => {
    if (!cyRef.current) return;
    cyRef.current.batch(() => {
      const c = LOOKUP[elemType].cy;
      assertExists(c, {
        why: "You do not need this binding in the react component if lookup doesn't define cy",
        details: {
          elemType,
        },
      });
      c.forEach(({ selectors, dataKey }) => {
        const elements = cyRef.current!.elements(selectors.join(","));
        enabled ? elements.removeData(dataKey) : elements.data(dataKey, true);
      });
    });
  }, [enabled]);
}

export const AstGraphSuccess: FC<AstGraphSuccessProps> = ({ elements }) => {
  const fontSize = 8;
  const animationDuration = 600;
  const cyRef = useRef<Core | null>(null);
  const ui = useUiStore();
  const { token } = theme.useToken();

  useCyStateBind(cyRef, "node_ast_head");
  useCyStateBind(cyRef, "node_ast_head_label");
  useCyStateBind(cyRef, "edge_ast_head");
  useCyStateBind(cyRef, "edge_ast_head_label");
  useCyStateBind(cyRef, "node_ast_extension");
  useCyStateBind(cyRef, "node_ast_extension_label");
  useCyStateBind(cyRef, "edge_ast_extension");
  useCyStateBind(cyRef, "edge_ast_extension_label");

  useCyStateBind(cyRef, "node_cpx");
  useCyStateBind(cyRef, "node_cpx_label");
  useCyStateBind(cyRef, "edge_cpx");
  useCyStateBind(cyRef, "edge_cpx_label");

  useCyStateBind(cyRef, "node_cps");
  useCyStateBind(cyRef, "node_cps_label");
  useCyStateBind(cyRef, "edge_cps");
  useCyStateBind(cyRef, "edge_cps_label");

  useCyStateBind(cyRef, "node_param");
  useCyStateBind(cyRef, "node_param_label");
  useCyStateBind(cyRef, "edge_param");
  useCyStateBind(cyRef, "edge_param_label");

  useCyStateBind(cyRef, "node_rawParam");
  useCyStateBind(cyRef, "node_rawParam_label");
  useCyStateBind(cyRef, "edge_rawParam");
  useCyStateBind(cyRef, "edge_rawParam_label");

  const cbOnTapNode = useCallback(
    (e: EventObject) => onTapNode(e, ui, animationDuration),
    [ui, animationDuration],
  );
  const cbOnTapNothing = useCallback(
    (e: EventObject) => onTapNothing(e, ui, animationDuration),
    [ui, animationDuration],
  );

  return (
    <>
      <CytoscapeComponent
        style={{ height: "100%" }}
        layout={layout}
        cy={(cy: Core) => {
          if (cyRef.current === cy) return; // ← critical
          cyRef.current = cy;
          cy.on("tap", "node", cbOnTapNode);
          cy.on("tap", cbOnTapNothing);
        }}
        stylesheet={buildStyleSheet(token, fontSize)}
        elements={elements}
      />
    </>
  );
};
