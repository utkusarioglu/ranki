import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import Cytoscape from "cytoscape";
import fcose from "cytoscape-fcose";
// @ts-expect-error
import CytoscapeComponent from "react-cytoscapejs";
import { Id, INIT_ID, run } from "./walk";
import { theme } from "antd";
import type { IAstNode, ICpx } from "@dqm/package-dqm-api-v2";

Cytoscape.use(fcose);

const layout = {
  name: "fcose",
  // name: "breadthfirst",
  directed: true,
  circle: false,
  animate: false,
  randomize: true,
  gravity: 0.25,
  gravityRange: 3.8,
  numIter: 1000,
  initialEnergyOnIncremental: 0.3,

  idealEdgeLength: (e: any) => {
    if (e.hasClass("external")) return 600;
    if (e.hasClass("cpx-cpx")) return 350;
    if (e.hasClass("cpx-cps")) return 50;
    if (e.hasClass("cps-ast") && e.hasClass("head")) return 60;
    // if (e.hasClass("cps-ast")) return 120;
    // if (e.hasClass("cpx-ast")) return 180;

    if (e.hasClass("cps-ast") || e.hasClass("cpx-ast")) {
      for (let d = 0; d < 20; d++) {
        if (e.hasClass(`depth-${d}`)) {
          return 50 * d;
        }
      }
    }
    return 100;
  },

  edgeElasticity: (e: any) => {
    if (e.hasClass("external")) return 0.02;
    if (e.hasClass("cpx-cpx")) return 0.05;
    if (e.hasClass("cpx-cps")) return 0.6;
    if (e.hasClass("cps-ast") && e.hasClass("head")) return 0.4;

    if (e.hasClass("cps-ast") || e.hasClass("cpx-ast")) {
      for (let d = 0; d < 20; d++) {
        if (e.hasClass(`depth-${d}`)) {
          return 0.15 * 10;
        }
      }
    }

    if (e.hasClass("cpx-ast")) return 0.1;
    if (e.hasClass("cps-ast")) return 0.1;
    return 0.2;
  },

  nodeRepulsion: (n: any) => {
    if (n.hasClass("cpx")) return 8000;
    if (n.hasClass("cps")) return 5000;
    if (n.hasClass("ast")) return 10000;
    return 2000; // ast
  },
};

const useToken = theme.useToken;

export const AstGraph = () => {
  const { token } = useToken();
  const dqm = useDqmStore();
  if (dqm.parsed.state !== "success") {
    return <div>Parse fail</div>;
  }
  const flattened = run(dqm.parsed.data[0].ast);

  if (flattened === null) {
    return <p>got null</p>;
  }

  const fontSize = 8;

  return (
    <CytoscapeComponent
      style={{ height: "100%" }}
      layout={layout}
      cy={(cy: any) => {
        cy.on("tap", "node", (evt: any) => {
          const data = evt.target.data();
          const elem = Id.getElem(data.id);

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
      stylesheet={[
        {
          selector: "node.cpx",
          style: {
            width: 20,
            height: 20,
            shape: "rectangle",
            label: "data(label)",
            "text-valign": "center",
            "text-halign": "left",
            "text-margin-x": -6,
            "font-size": fontSize,
            color: token.colorPrimary,
            "background-color": token.colorPrimary,
          },
        },
        {
          selector: "node.cps",
          style: {
            width: 20,
            height: 20,
            shape: "triangle",
            label: "data(label)",
            "text-valign": "center",
            "text-halign": "left",
            "text-margin-x": -6,
            "font-size": fontSize,
            color: "#CCC",
            "background-color": "#CCC",
          },
        },
        {
          selector: "node.ast.subtree",
          style: {
            width: 20,
            height: 20,
            shape: "diamond",
            label: "data(label)",
            "text-valign": "center",
            "text-halign": "left",
            "text-margin-x": -6,
            "font-size": fontSize,
            color: "#006644",
            "background-color": "#006644",
          },
        },
        // {
        //   selector: "node.ast.child",
        //   style: {
        //     width: 20,
        //     height: 20,
        //     shape: "diamond",
        //     label: "data(label)",
        //     "text-valign": "center",
        //     "text-halign": "left",
        //     "text-margin-x": -6,
        //     "font-size": fontSize,
        //     color: "#004466",
        //     "background-color": "#004466",
        //   },
        // },

        {
          selector: "edge.cpx-cpx",
          style: {
            "line-color": token.colorPrimary,
            width: 1,
          },
        },
        {
          selector: "edge.cpx-cps",
          style: {
            "line-color": token.colorBgSolid,
            width: 1,
          },
        },
        {
          selector: "edge.cpx-ast",
          style: {
            "line-color": "#202020",
            "line-style": "dashed",
            width: 1,
            opacity: 0,
          },
        },
        {
          selector: "edge.cps-ast",
          style: {
            "line-color": "#999",
            // "line-style": "dashed",
            width: 1,
            opacity: 0,
          },
        },
        {
          selector: "edge.cps-ast.head",
          style: {
            opacity: 1,
          },
        },
        {
          selector: "edge.ast-ast.subtree",
          style: {
            "line-color": "#555",
            width: 0.2,
          },
        },
        {
          selector: "edge.ast-ast.child",
          style: {
            "line-color": "#FF0000",
            width: 0.2,
          },
        },
      ]}
      elements={flattened}
    />
  );
};
