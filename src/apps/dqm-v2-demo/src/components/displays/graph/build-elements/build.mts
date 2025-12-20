import type { IAstNode } from "@dqm/package-dqm-api-v2";
import type { Flattened } from "./build.types";
import { Id } from "./id.mts";
import { traverseCpx } from "./cpx.mts";
import { traverseCps } from "./cps.mts";
import { flatten, getRoot } from "./utils.mts";
import { traverseAst } from "./ast.mts";
import { traverseParams } from "./param.mts";

export function buildElements(currAst: IAstNode): Flattened | null {
  Id.reset();
  const currCpx = currAst.getCpx();
  if (!currCpx) {
    return null;
  }
  const [rootCpx, cpxClimbs] = getRoot(currCpx);
  if (!rootCpx) {
    return null;
  }
  const cpxTraversed = traverseCpx(rootCpx, cpxClimbs);
  if (!cpxTraversed) {
    return null;
  }

  const currCps = currCpx.getRootCps();
  const [rootCps, cpsClimb] = getRoot(currCps);
  if (!rootCps) {
    return null;
  }
  const cpsTraversed = traverseCps(rootCps, cpsClimb);
  if (!cpsTraversed) {
    return null;
  }

  const [rootAst, astClimbs] = getRoot(currAst);
  if (!rootAst) {
    return null;
  }
  const astTraversed = traverseAst(rootAst, astClimbs);
  if (!astTraversed) {
    return null;
  }
  const paramsTraversed = traverseParams(rootCpx);
  if (!paramsTraversed) {
    return null;
  }

  const flattened = flatten([
    cpxTraversed,
    cpsTraversed,
    astTraversed,
    paramsTraversed,
  ]);
  return flattened;
}
