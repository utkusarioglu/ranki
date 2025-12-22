import type { ICps, IParam } from "@dqm/package-dqm-api-v2";
import { Registry } from "./registry.mts";
import { classes } from "./utils.mts";
import type { E, IdValue, N } from "./build.types";

function traverseParam(cpsId: IdValue, param: IParam) {
  const id = Registry.getNew(param);
  const producer = param.getProducer();
  const node: N = {
    data: {
      id,
      label: "param:" + param.getId().getChain().join("."),
    },
    classes: classes("param", `producer-${producer}`),
  };
  Registry.registerNode(node);

  const rawParam = param.getRawParam();
  console.log(param, rawParam);
  if (rawParam) {
    Registry.registerEdge({
      data: {
        source: id,
        target: Registry.getId(rawParam),
        label: "represents",
      },
      classes: classes("param-rawParam"),
    });
  }

  Registry.registerEdge({
    data: {
      source: cpsId,
      target: id,
      label: "customizes",
    },
    classes: classes("cps-param", `producer-${producer}`),
  });

  const prev = param.getPrev();
  if (prev) {
    const source = Registry.getId(prev);
    console.log(source);
    const edge: E = {
      data: {
        source,
        target: id,
        label: "sibling",
      },
      classes: classes("param-param", "sibling"),
    };
    Registry.registerEdge(edge);
  }
}

export function traverseParams(root: ICps) {
  if (!root) {
    return;
  }
  const cpsId = Registry.getId(root);
  root.getParams().map((p) => traverseParam(cpsId, p));

  root.getChildren().map((c) => traverseParams(c));
}
