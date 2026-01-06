import type { IAstNode } from "@dqm/package-dqm-api-v2";
import type { Flattened } from "./build.types";
import { Registry } from "./registry.mts";
import { traverseCpx } from "./cpx.mts";
import { traverseCps } from "./cps.mts";
import { getRoot } from "./utils.mts";
import { traverseAst } from "./ast.mts";
import { traverseAstParams } from "./ast-param.mts";
import { traverseParams } from "./cps-params.mts";

export function buildElements(currAst: IAstNode): Flattened | null {
  Registry.reset();
  const currCpx = currAst.getCpx();
  if (!currCpx) {
    return null;
  }
  const [rootCpx, cpxClimbs] = getRoot(currCpx, "getCpxParent");
  if (!rootCpx) {
    return null;
  }
  traverseCpx(rootCpx, cpxClimbs);
  const currCps = currCpx.getRootCps();
  const [rootCps, cpsClimb] = getRoot(currCps, "getCpsParent");
  traverseCps(rootCps, cpsClimb);

  traverseAst(...getRoot(currAst, "getAstParent"));
  traverseAstParams(rootCpx);
  traverseParams(currCps);

  return Registry.getProductArray();
}
