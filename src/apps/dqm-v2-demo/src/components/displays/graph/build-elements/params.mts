import type { ICps, ICpsParam } from "@dqm/package-dqm-api-v2";
import { Registry } from "./registry.mts";
import { cls } from "./utils.mts";
import type { IdValue, N } from "./build.types";
import { createSanitizedView } from "../../../../utils/sanitizer.mts";
import { assertTryCatchSuccess } from "_assertions";

function traverseCpsParam(cpsId: IdValue, raw: ICpsParam) {
  const id = Registry.getNew(raw);
  const root = createSanitizedView(raw);
  Registry.registerSanitized(id, root);
  const producerPre = root.getProducer();
  assertTryCatchSuccess(producerPre, {
    why: "param producer needs to be defined",
  });
  const producer = producerPre.value;
  const chainStringPre = root.getChainString();
  assertTryCatchSuccess(chainStringPre, { why: "param id is required" });
  const chainString = chainStringPre.value;

  const node: N = {
    data: {
      id,
      label: "CpsParam:" + chainString,
    },
    classes: cls("cpsParam", `producer-${producer}`),
  };
  Registry.registerNode(node);

  const astParamPre = root.getAstParam();
  assertTryCatchSuccess(astParamPre, { why: "astParam is required" });
  const astParam = astParamPre.value;
  if (astParam) {
    Registry.registerEdge({
      data: {
        source: id,
        target: Registry.getId(astParam),
        label: "represents",
      },
      classes: cls("source-cpsParam", "target-astParam"),
    });
  }

  Registry.registerEdge({
    data: {
      source: cpsId,
      target: id,
      label: "customizes",
    },
    classes: cls("source-cps", "target-cpsParam", `producer-${producer}`),
  });

  // const prevPre = root.getPrev();
  // assertTryCatchSuccess(prevPre, { why: "previous param is required" });
  // const prev = prevPre.value;
  // if (prev) {
  //   const source = Registry.getId(prev);
  //   const edge: E = {
  //     data: {
  //       source,
  //       target: id,
  //       label: "sibling",
  //     },
  //     classes: cls("source-param", "target-param", "sibling"),
  //   };
  //   Registry.registerEdge(edge);
  // }
}

export function traverseParams(raw: ICps) {
  if (!raw) {
    return;
  }
  const cpsId = Registry.getId(raw);
  const root = createSanitizedView(raw);
  const paramsPre = root.getParams();
  assertTryCatchSuccess(paramsPre, { why: "cps params is required" });
  paramsPre.value.map((p) => traverseCpsParam(cpsId, p));

  const childrenPre = root.getChildren();
  assertTryCatchSuccess(childrenPre, { why: "Children is required" });
  childrenPre.value.map((c) => traverseParams(c));
}
