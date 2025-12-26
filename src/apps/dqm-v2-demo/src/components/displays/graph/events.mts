import type {
  GraphDrawerDataTypes,
  UiStore,
} from "_stores/ui/ui.store.types.mjs";
import type { Core, EventObject } from "cytoscape";
import { Registry } from "./build-elements/registry.mts";
import type { N } from "./build-elements/build.types";
import type cytoscape from "cytoscape";

const CIRCLE_TILT = Math.PI / -12;
const RADIUS_LOW_THRESHOLD = 120;

/**
 * @dev
 * #1 Cytoscape lacks type for this but it works.
 */
function placeRadially(
  cy: Core,
  focused: cytoscape.NodeSingular,
  neighbors: cytoscape.NodeCollection,
  radiusFactor: number = 30,
  animationDuration: number,
  padding: number = 50,
) {
  const n = neighbors.length;
  let radius = Math.ceil(Math.sqrt(n)) * radiusFactor;
  radius = Math.max(radius, RADIUS_LOW_THRESHOLD);
  const center = focused.position();

  neighbors.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / n + CIRCLE_TILT;

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

  // const padding = 40;
  const rect = radius + padding;

  const boundingBox = {
    x1: center.x - rect,
    y1: center.y - rect,
    x2: center.x + rect,
    y2: center.y + rect,
  };

  setTimeout(() => {
    const container = cy.container()!;
    const cw = container.clientWidth;
    const ch = container.clientHeight;

    const bbWidth = boundingBox.x2 - boundingBox.x1;
    const bbHeight = boundingBox.y2 - boundingBox.y1;

    const zoom = Math.min(
      (cw - padding * 2) / bbWidth,
      (ch - padding * 2) / bbHeight,
    );

    const centerX = (boundingBox.x1 + boundingBox.x2) / 2;
    const centerY = (boundingBox.y1 + boundingBox.y2) / 2;

    cy.animate(
      {
        zoom,
        pan: {
          x: cw / 2 - zoom * centerX,
          y: ch / 2 - zoom * centerY,
        },
      },
      {
        duration: animationDuration,
        easing: "ease-in-out",
      },
    );
  }, animationDuration / 2);

  // setTimeout(() => {
  //   cy.animate(
  //     {
  //       fit: {
  //         // @ts-expect-error #1
  //         boundingBox,
  //         padding,
  //       },
  //     },
  //     {
  //       duration: animationDuration,
  //       easing: "ease-in-out",
  //     },
  //   );
  // }, animationDuration / 2);
}

function restorePositions(cy: Core, animationDuration: number) {
  cy.nodes().forEach((node) => {
    const position = node.scratch("_origPos");
    if (!position) return;

    node.animate(
      { position },
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

  placeRadially(cy, node, focus.not(node), 30, animationDuration, 40);

  // DRAWER
  const cyNode: N = {
    data: e.target.data(),
    classes: e.target.classes(),
  };
  ui.setTemplateDrawerState({
    type: "graph",
    // @ts-expect-error #1
    data: {
      type: cyNode.data.label.split(":")[0] as GraphDrawerDataTypes,
      sanitizedDqmNode: Registry.getSanitized(cyNode.data.id),
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
