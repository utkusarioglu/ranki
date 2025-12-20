import type { ICpx, IParam } from "@dqm/package-dqm-api-v2";
import { Registry } from "./registry.mts";
import { classes } from "./utils.mts";

export function traverseParams(root: ICpx): void {
  if (!root) {
    return;
  }
  const params = root.getParams();
  if (params) {
    params.forEach((p) => traverseParam(p));
  }

  root.getChildren().forEach((r) => traverseParams(r));
}

function traverseParam(root: IParam | null): void {
  if (!root) {
    return;
  }
  const node = Registry.getNode(root);
  node.data.label = "param:" + root.getId().getId().join(".");
  node.classes = classes("param");
  const id = node.data.id;

  const creatorCpx = root.getCpx();
  if (creatorCpx) {
    const source = Registry.getId(creatorCpx);
    const e = Registry.getEdge(source, id);
    e.classes = classes("cpx-param");
    e.data.label = "customizes";

    creatorCpx.getCpsList().forEach((n) => {
      const source = Registry.getId(n);
      const e = Registry.getEdge(source, id);
      e.classes = classes("cps-param");
      e.data.label = "customizes";
    });
  }
}
