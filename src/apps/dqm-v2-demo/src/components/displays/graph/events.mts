import type {
  GraphDrawerDataTypes,
  UiStore,
} from "_stores/ui/ui.store.types.mjs";
import type { Core, EventObject } from "cytoscape";
import { Registry } from "./build-elements/registry.mts";
import type { N } from "./build-elements/build.types";
import type cytoscape from "cytoscape";

/**
 * @dev
 * #1 Cytoscape lacks type for this but it works.
 */
function placeRadially(
  cy: Core,
  focused: cytoscape.NodeSingular,
  neighbors: cytoscape.NodeCollection,
  radius: number = 120,
  animationDuration: number,
) {
  const n = neighbors.length;
  const center = focused.position();

  neighbors.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / n;

    node.animate(
      {
        position: {
          x: center.x + radius * Math.cos(angle),
          y: center.y + radius * Math.sin(angle),
        },
      },
      {
        duration: animationDuration,
        easing: "ease-in-out",
      },
    );
  });

  const padding = 50;
  const rect = radius + padding;

  const boundingBox = {
    x1: center.x - rect,
    y1: center.y - rect,
    x2: center.x + rect,
    y2: center.y + rect,
  };

  setTimeout(() => {
    cy.animate(
      {
        fit: {
          // @ts-expect-error #1
          boundingBox,
          padding,
        },
      },
      {
        duration: animationDuration,
        easing: "ease-in-out",
      },
    );
  }, animationDuration / 2);
}

function restorePositions(cy: Core, animationDuration: number) {
  cy.nodes().forEach((node) => {
    const pos = node.scratch("_origPos");
    if (!pos) return;

    node.animate(
      { position: pos },
      {
        duration: animationDuration,
        easing: "ease-in-out",
      },
    );

    node.removeScratch("_origPos");
  });
}

function storePositions(eles: cytoscape.NodeCollection) {
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
  focus.removeClass("dimmed");

  // Everything else
  const others = cy.elements().difference(focus);
  others.removeClass("focused");

  cy.elements().removeClass("dimmed");
  focus.addClass("focused");
  others.addClass("dimmed");

  storePositions(focus.not(node));

  placeRadially(cy, node, focus.not(node), 120, animationDuration);

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
    restorePositions(cy, animationDuration);

    const elems = cy.elements();
    elems.removeClass("dimmed");
    elems.removeClass("focused");
    setTimeout(() => {
      cy.animate({
        fit: {
          eles: elems,
          padding: 50,
        },
        duration: animationDuration,
        easing: "ease-in-out",
      });
    }, animationDuration / 2);
    ui.setTemplateDrawerState(null);
  }
}
