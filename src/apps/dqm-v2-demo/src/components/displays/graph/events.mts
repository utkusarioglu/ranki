import type {
  GraphDrawerDataTypes,
  UiStore,
} from "_stores/ui/ui.store.types.mjs";
import type { EventObject } from "cytoscape";
import { Registry } from "./build-elements/registry.mts";
import type { N } from "./build-elements/build.types";

function storePositions(eles) {
  eles.forEach((ele) => {
    if (!ele.scratch("_origPos")) {
      ele.scratch("_origPos", { ...ele.position() });
    }
  });
}

/**
 * @dev
   #1 Crossing types they are all dependent on `type` and `Registry` to work correctly
 */
export function onTapNode(
  e: EventObject,
  ui: UiStore,
  animationDuration: number,
) {
  const cy = e.cy;

  const node = e.target;
  const focus = node.closedNeighborhood().union(node.parents());
  // const focus = node.closedNeighborhood();
  // Everything else
  const others = cy.elements().difference(focus);

  cy.elements().removeClass("dimmed");
  focus.addClass("focused");
  others.addClass("dimmed");

  cy.animate({
    fit: {
      eles: focus,
      padding: 50,
    },
    duration: animationDuration,
    easing: "ease-in-out",
  });

  // DRAWER
  const cyNode: N = {
    data: e.target.data(),
    classes: e.target.classes(),
  };
  console.log("cy", cyNode);
  ui.setTemplateDrawerState({
    type: "graph",
    // @ts-expect-error #1
    data: {
      type: cyNode.data.label.split(":")[0] as GraphDrawerDataTypes,
      dqmNode: Registry.getSource(cyNode.data.id),
      cyNode,
    },
  });
}

export function onTapNothing(
  e: EventObject,
  ui: UiStore,
  animationDuration: number,
) {
  const cy = e.cy;
  if (e.target === cy) {
    const elems = cy.elements();
    elems.removeClass("dimmed");
    elems.removeClass("focused");
    cy.animate({
      fit: {
        eles: elems,
        padding: 50,
      },
      duration: animationDuration,
      easing: "ease-in-out",
    });
    ui.setTemplateDrawerState(null);
  }
}

// cy.on("tap", "node", (e: any) => {
// const data = evt.target.data();
// const elem = Registry.getSource(data.id);
// const labelPrefix = data.label.split(":")[0];
// switch (labelPrefix) {
//   case "cpx":
//     console.log((elem as ICpx).getRootAst().getSourceString());
//     break;
//   case "ast":
//     console.log((elem as IAstNode).getSourceString());
//     break;
//   default:
//     console.log("Not implemented", labelPrefix, data.label);
// }
// });

// cy.on("tap", "node", (e: any) => {
// const pos = e.target.renderedPosition();
// const rect = cy.container().getBoundingClientRect();
// setPop({
//   x: rect.left + pos.x,
//   y: rect.top + pos.y,
//   data: e.target.data(),
// });
// });
