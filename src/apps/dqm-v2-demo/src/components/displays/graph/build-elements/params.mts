import type { ICps, IParam } from "@dqm/package-dqm-api-v2";
import { Registry } from "./registry.mts";
import { cls } from "./utils.mts";
import type { E, IdValue, N } from "./build.types";
import { createSanitizedView } from "../../../../utils/sanitizer.mts";
import { assertTryCatchSuccess } from "_assertions";

function traverseParam(cpsId: IdValue, raw: IParam) {
  const id = Registry.getNew(raw);
  const param = createSanitizedView(raw);
  const producer = param.getProducer();
  const paramIdPre = param.getId();
  assertTryCatchSuccess(paramIdPre, { why: "param id is required" });
  const paramId = paramIdPre.value;

  const node: N = {
    data: {
      id,
      label: "param:" + paramId.getChainString(),
    },
    classes: cls("param", `producer-${producer}`),
  };
  Registry.registerNode(node);

  const rawParamPre = param.getRawParam();
  assertTryCatchSuccess(rawParamPre, { why: "rawParam is required" });
  const rawParam = rawParamPre.value;
  if (rawParam) {
    Registry.registerEdge({
      data: {
        source: id,
        target: Registry.getId(rawParam),
        label: "represents",
      },
      classes: cls("source-param", "target-rawParam"),
    });
  }

  Registry.registerEdge({
    data: {
      source: cpsId,
      target: id,
      label: "customizes",
    },
    classes: cls("source-cps", "target-param", `producer-${producer}`),
  });

  const prevPre = param.getPrev();
  assertTryCatchSuccess(prevPre, { why: "previous param is required" });
  const prev = prevPre.value;
  if (prev) {
    const source = Registry.getId(prev);
    const edge: E = {
      data: {
        source,
        target: id,
        label: "sibling",
      },
      classes: cls("source-param", "target-param", "sibling"),
    };
    Registry.registerEdge(edge);
  }
}

export function traverseParams(raw: ICps) {
  if (!raw) {
    return;
  }
  const cpsId = Registry.getId(raw);
  const root = createSanitizedView(raw);
  const paramsPre = root.getParams();
  assertTryCatchSuccess(paramsPre, { why: "params is required" });
  paramsPre.value.map((p) => traverseParam(cpsId, p));

  const childrenPre = root.getChildren();
  assertTryCatchSuccess(childrenPre, { why: "Children is required" });
  childrenPre.value.map((c) => traverseParams(c));
}
