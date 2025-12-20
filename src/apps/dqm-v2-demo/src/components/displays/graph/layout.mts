const REPULSION_FACTOR = 1000;

export const layout = {
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
    if (e.hasClass("relationship-external")) return 600;
    if (e.hasClass("sibling")) return 1;

    if (e.hasClass("cpx-cpx")) return 350;
    if (e.hasClass("cpx-cps")) return 50;
    if (e.hasClass("cps-ast") && e.hasClass("head")) return 60;

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
    if (e.hasClass("relations-external")) return 0.02;
    if (e.hasClass("sibling")) return 0;

    if (e.hasClass("cpx-cpx")) return 0.05;
    if (e.hasClass("cpx-cps")) return 0.6;
    if (e.hasClass("cps-ast") && e.hasClass("head")) return 0.4;

    if (e.hasClass("cps-ast") || e.hasClass("cpx-ast")) {
      for (let d = 0; d < 20; d++) {
        if (e.hasClass(`depth-${d}`)) {
          return 0;
        }
      }
    }

    // if (e.hasClass("cpx-ast")) return 0.1;
    // if (e.hasClass("cps-ast")) return 0.1;
    return 0.2;
  },

  nodeRepulsion: (n: any) => {
    if (n.hasClass("cpx")) return 8000;
    if (n.hasClass("cps")) return 5000;
    if (n.hasClass("ast")) return 10000;
    return 2000;
  },
};
