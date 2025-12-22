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
import { useCallback, useEffect, useMemo, useRef, type FC } from "react";
import { onTapNode, onTapNothing } from "./events.mts";
import type { DqmParseOutput } from "@dqm/package-dqm-api-v2";
import { useErrorBoundary } from "react-error-boundary";
import { useGraphViewStore } from "_stores/graph-view/graph-view.store.mjs";

Cytoscape.use(fcose);

export const AstGraph = () => {
  const dqm = useDqmStore();
  const boundary = useErrorBoundary();

  if (dqm.parsed.state !== "success") {
    boundary.showBoundary(dqm.parsed.error);
    return null;
    // return <div>Parse fail</div>;
  }

  return <AstGraphSuccess data={dqm.parsed.data} />;
};
interface AstGraphSuccessProps {
  data: DqmParseOutput;
}

export const AstGraphSuccess: FC<AstGraphSuccessProps> = ({ data }) => {
  const fontSize = 8;
  const animationDuration = 600;
  const cyRef = useRef<Core | null>(null);
  const graphView = useGraphViewStore();
  const ui = useUiStore();
  const { token } = theme.useToken();

  useEffect(() => {
    if (cyRef.current) {
      const elements = cyRef.current.elements("node.ast");
      if (graphView.ast) {
        elements.removeClass("hidden");
      } else {
        elements.addClass("hidden");
      }
    }
  }, [graphView.ast]);

  useEffect(() => {
    if (cyRef.current) {
      const elements = cyRef.current.elements("node.cpx");
      if (graphView.cpx) {
        elements.removeClass("hidden");
      } else {
        elements.addClass("hidden");
      }
    }
  }, [graphView.cpx]);

  useEffect(() => {
    if (cyRef.current) {
      const elements = cyRef.current.elements("node.cps");
      if (graphView.cps) {
        elements.removeClass("hidden");
      } else {
        elements.addClass("hidden");
      }
    }
  }, [graphView.cps]);

  useEffect(() => {
    if (cyRef.current) {
      const elements = cyRef.current.elements("node.param");
      if (graphView.param) {
        elements.removeClass("hidden");
      } else {
        elements.addClass("hidden");
      }
    }
  }, [graphView.param]);

  useEffect(() => {
    if (cyRef.current) {
      const elements = cyRef.current.elements("node.rawParam");
      if (graphView.rawParam) {
        elements.removeClass("hidden");
      } else {
        elements.addClass("hidden");
      }
    }
  }, [graphView.rawParam]);

  useEffect(() => {
    if (cyRef.current) {
      const elements = cyRef.current.elements("edge");
      if (graphView.edgeLabels) {
        elements.removeClass("hidden-label");
      } else {
        elements.addClass("hidden-label");
      }
    }
  }, [graphView.edgeLabels]);

  const cbOnTapNode = useCallback(
    (e: EventObject) => onTapNode(e, ui, animationDuration),
    [ui, animationDuration],
  );
  const cbOnTapNothing = useCallback(
    (e: EventObject) => onTapNothing(e, ui, animationDuration),
    [ui, animationDuration],
  );

  const elements = useMemo(() => buildElements(data[0].ast), [data]);

  if (elements === null) {
    return <p>got null</p>;
  }

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
