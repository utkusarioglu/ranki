import type { ICpx, IParam } from "@dqm/package-dqm-api-v2";
import { Registry } from "./registry.mts";
import { cls } from "./utils.mts";

export function traverseRawParams(root: ICpx): void {
  if (!root) {
    return;
  }
  const params = root.getRawParams();
  if (params) {
    params.forEach((p) => traverseParam(p));
  }

  root.getChildren().forEach((r) => traverseRawParams(r));
}

function traverseParam(root: IParam | null): void {
  if (!root) {
    return;
  }
  const node = Registry.getNode(root);
  node.data.label = "rawParam:" + root.getId().getId().join(".");
  node.classes = cls("rawParam");
  const id = node.data.id;

  // TODO register param sibling relationship as well. the code below does ast-ast sibling instead so it's not the right call.
  // const prevParam = root.getPrev();
  // if (prevParam) {
  //   const prevParamId = Registry.getId(prevParam);
  //   const edge = Registry.getEdge(prevParamId, id);
  //   edge.classes = "param-param sibling";
  //   // Registry.registerEdge({
  //   //   data: {
  //   //     source: prevParamId,
  //   //     target: id,
  //   //     label: "sibling",
  //   //   },
  //   //   classes: "param-param sibling",
  //   // });
  // }

  const creatorCpx = root.getCpx();
  if (creatorCpx) {
    const source = Registry.getId(creatorCpx);
    const e = Registry.getEdge(source, id);
    e.classes = cls("source-cpx", "target-rawParam");
    e.data.label = "collects";

    // creatorCpx.getCpsList().forEach((n) => {
    //   const source = Registry.getId(n);
    //   const e = Registry.getEdge(source, id);
    //   e.classes = classes("cps-rawParam");
    //   e.data.label = "customizes";
    // });
  }
}
