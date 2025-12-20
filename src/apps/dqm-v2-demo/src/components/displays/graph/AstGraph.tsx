import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import Cytoscape from "cytoscape";
import fcose from "cytoscape-fcose";
// @ts-expect-error
import CytoscapeComponent from "react-cytoscapejs";
import { buildElements } from "./build-elements/build.mts";
import { theme } from "antd";
import type { IAstNode, ICpx } from "@dqm/package-dqm-api-v2";
import { Id } from "./build-elements/id.mts";
import { buildStyleSheet } from "./stylesheet/stylesheet.mts";
import { layout } from "./layout.mts";

Cytoscape.use(fcose);

export const AstGraph = () => {
  const fontSize = 8;
  const { token } = theme.useToken();
  const dqm = useDqmStore();
  if (dqm.parsed.state !== "success") {
    return <div>Parse fail</div>;
  }
  const elements = buildElements(dqm.parsed.data[0].ast);

  if (elements === null) {
    return <p>got null</p>;
  }

  return (
    <CytoscapeComponent
      style={{ height: "100%" }}
      layout={layout}
      cy={(cy: any) => {
        cy.on("tap", "node", (evt: any) => {
          const data = evt.target.data();
          const elem = Id.getSource(data.id);

          const labelPrefix = data.label.split(":")[0];
          switch (labelPrefix) {
            case "cpx":
              console.log((elem as ICpx).getRootAst().getSourceString());
              break;
            case "ast":
              console.log((elem as IAstNode).getSourceString());
              break;
            default:
              console.log("Not implemented", labelPrefix, data.label);
          }
        });
      }}
      stylesheet={buildStyleSheet(token, fontSize)}
      elements={elements}
    />
  );
};
