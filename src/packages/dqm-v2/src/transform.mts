import type {
  DqmParseOutput,
  DqmTransformOutput,
  ICps,
  ICpx,
  ITrnCpsRootNode,
  ITrnCpxNode,
  TrnCpxRegistry,
} from "@dqm/package-dqm-api-v2";
import { assertExists } from "@dqm/package-dqm-utils";
import { TrnCpxNode } from "./nodes/trn/trn-cpx.mjs";
import { TrnCpsRootNode } from "./nodes/trn/trn-cps-root.mjs";
import { CommonTransports } from "./nodes/common-transports.mjs";

export class DqmTransformer extends CommonTransports {
  private trnRegistry: TrnCpxRegistry = new WeakMap();

  transform(parsed: DqmParseOutput): DqmTransformOutput {
    return parsed.map((v) => {
      const cpx = v.ast.getCpx();
      assertExists(cpx, {
        why: "Parsed asts are expected to have an attached Cpx",
      });
      const trnCpx = this.buildGraph(cpx);
      trnCpx.transform();

      return {
        theater: v.theater,
        trn: trnCpx,
      };
    });
  }

  private buildGraph(cpx: ICpx): ITrnCpxNode {
    const trnCpx = this.buildTrnCpx(cpx);
    const cps = cpx.getRootCps();
    this.buildTrnCps(cps);
    return trnCpx;
  }

  private buildTrnCpx(cpx: ICpx): ITrnCpxNode {
    return new TrnCpxNode(cpx, this.trnRegistry, this.getTransports());
  }

  private buildTrnCps(cps: ICps): ITrnCpsRootNode {
    return new TrnCpsRootNode(cps, this.trnRegistry, this.getTransports());
  }
}
