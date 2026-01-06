import type {
  ChildrenNodes,
  DqmParseOutput,
  DqmParseOutputTheater,
  DqmTransformOutput,
  DqmTransformOutputTheater,
  IAstNode,
  ICps,
  ICpx,
  ITrnNode,
  ITCpsNode,
  ITCpxNode,
  SubtreeNodes,
} from "@dqm/package-dqm-api-v2";
import { CommonTransports } from "./nodes/common-transports.mjs";
import { TCpxNode } from "./nodes/trn/t-cpx.mjs";
import {
  assertNotExists,
  assertExists,
  assertNever,
} from "./errors/dqm-app-error/assertions.mjs";
import { TCpsNode } from "./nodes/trn/t-cps.mjs";
import { TrnNode } from "./nodes/trn/trn.mjs";
import { assertArrayNotEmpty } from "@dqm/package-dqm-utils";

export type TCpxRegistry = WeakMap<ICpx, ITCpxNode>;

export class DqmTransformer extends CommonTransports {
  private tCpxRegistry: TCpxRegistry = new WeakMap();

  transform(parsed: DqmParseOutput): DqmTransformOutput {
    const graph = parsed.map((t) => this.buildGraph(t));
    graph.forEach((g) => g.tCpx.transform());
    return graph;
  }

  private buildGraph(t: DqmParseOutputTheater): DqmTransformOutputTheater {
    const cpx = t.ast.getCpx();
    assertExists(cpx, {
      why: "Parsed asts are expected to have an attached Cpx",
    });

    const tCpx = this.buildTCpxGraph(cpx);
    this.buildTCpsGraph(cpx.getRootCps());
    let l = [cpx];

    while (l.length) {
      const curr = l.shift()!;
      this.buildTrnNodeGraph(curr.getRootAst(), "subtree");
      // tCps.assignTrn(trn);
      // tCpx.assignTrn(trn);
      l.push(...curr.getCpxEdges());
    }

    return {
      theater: t.theater,
      tCpx: tCpx,
    };
  }

  private buildTCpxGraph(cpx: ICpx): TCpxNode {
    const pushToTCpxRegistry = (cpx: ICpx, tCpx: TCpxNode) => {
      assertNotExists(this.tCpxRegistry.get(cpx), {
        why: "Existence would point to a cpx cycle",
      });
      this.tCpxRegistry.set(cpx, tCpx);
    };

    function dfs(cpx: ICpx): TCpxNode {
      const tCpx = new TCpxNode(cpx);
      pushToTCpxRegistry(cpx, tCpx);
      cpx.getCpxEdges().forEach((c) => {
        dfs(c).setTCpxParent(tCpx);
      });
      return tCpx;
    }
    return dfs(cpx);
  }

  private buildTCpsGraph(cps: ICps): void {
    const self = this;

    function dfs(cps: ICps): ITCpsNode {
      const cpx = cps.getCpx();
      assertExists(cpx, { why: "Cps should have an assigned Cpx" });
      const tCpx = self.tCpxRegistry.get(cpx);
      assertExists(tCpx, {
        why: "Cps references a cpx that has no tCpx counterpart",
      });
      const tCps = new TCpsNode(cps, tCpx);

      cps.getCpsEdges().forEach((c) => {
        dfs(c).setTCpsParent(tCps);
      });

      tCps.tCpx.pushTCpsEdge(tCps);
      return tCps;
    }
    dfs(cps);
  }

  private buildTrnNodeGraph(
    ast: IAstNode,
    family: "subtree" | "children",
  ): void {
    const self = this;
    const root: ITrnNode[] = [];
    let method: (
      node: IAstNode,
    ) => SubtreeNodes<IAstNode> | ChildrenNodes<IAstNode>;

    switch (family) {
      case "subtree":
        method = (node) => node.getSubtreeNodes();
        break;
      case "children":
        method = (node) => node.getChildrenNodes();
        break;
      default:
        assertNever({ why: "Unrecognized `family`", details: { family } });
    }

    function dfs(ast: IAstNode, currentMetaParent: ITrnNode | null): void {
      const tc = ast.getTransformClass();
      let nextMetaParent = currentMetaParent;

      if (tc !== null) {
        const cpx = ast.getCpx();
        assertExists(cpx, {
          why: "Ast has to have a cpx reference",
        });

        const tCpx = self.tCpxRegistry.get(cpx);
        assertExists(tCpx, {
          why: "Cps references a cpx that has no tCpx counterpart",
        });
        const tCps = tCpx.tCps;
        const trn = new TrnNode(ast, tCpx, tCps, self.getTransports());

        if (currentMetaParent) {
          trn.setTrnParent(currentMetaParent);
        } else {
          root.push(trn);
        }

        nextMetaParent = trn;
      }

      method(ast).forEach((c) => dfs(c, nextMetaParent));
    }

    dfs(ast, null);

    assertArrayNotEmpty(root, {
      why: "There are no transform class marked nodes in the subtree",
    });
    root[0].tCpx.assignTrn(root);
    root[0].tCpsList.forEach((s) => s.assignTrn(root));
  }
}
