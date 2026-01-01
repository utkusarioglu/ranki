import type {
  CommonTransportsConstructorParams,
  ICpx,
  ISerializedNode,
  ITrnCpsNode,
  ITrnCpxNode,
} from "@dqm/package-dqm-api-v2";
import { CommonTransports } from "../common-transports.mjs";
import { DqmAppError } from "../../errors/dqm-app-error/dqm-app-error.mjs";

export class TrnCpxNode extends CommonTransports implements ITrnCpxNode {
  public readonly cpx;
  public readonly childrenTrnCpx: ITrnCpxNode[] = [];
  public readonly ownedTrnCps: ITrnCpsNode[] = [];
  // public ownedTrnCpsTree: ITrnCpsNode | null = null;

  constructor(cpx: ICpx, s: CommonTransportsConstructorParams) {
    super(s);
    this.cpx = cpx;
    this.initChildrenTrnCpx();
    this.initOwnedTrnCps();
    this.linkOwnedTrnCps();
  }

  getOwnedTrnCpsTreeRoot(): ITrnCpsNode {
    return this.ownedTrnCps[0];
  }

  getOwnedTrnCpsTreeUnboundParents(): ITrnCpsNode[] {
    const leaves: ITrnCpsNode[] = [];
    const set = new Set<ITrnCpsNode>();
    set.add(this.getOwnedTrnCpsTreeRoot());
    while (set.size) {
      const values = set.values();
      for (const curr of values) {
        set.delete(curr);
        if (curr.getKind() === "parent" && !curr.getChildren().length) {
          leaves.push(curr);
        } else {
          curr.getChildren().forEach((c) => set.add(c));
        }
      }
    }
    return leaves;
  }

  private initChildrenTrnCpx() {
    const transports = this.getTransports();
    const TrnCpx = this.getPlugins().getTrnCpxNodeConstructor();
    this.cpx
      .getChildren()
      .forEach((c) => this.childrenTrnCpx.push(new TrnCpx(c, transports)));
  }

  private initOwnedTrnCps() {
    const transports = this.getTransports();
    const TrnCps = this.getPlugins().getTrnCpsNodeConstructor();
    this.cpx.getCpsList().map((c, i) => {
      const n = new TrnCps(c, transports);
      if (i > 0) {
        n.setParent(this.ownedTrnCps[i - 1]);
      }
      this.ownedTrnCps.push(n);
    });
  }

  private linkOwnedTrnCps() {
    const leaves = this.getOwnedTrnCpsTreeUnboundParents();
    const roots = this.childrenTrnCpx.map((c) => c.getOwnedTrnCpsTreeRoot());
    if (leaves.length < roots.length) {
      throw new DqmAppError({
        code: "INCONSISTENT_LENGTHS",
        why: "Cps leaves and cpx roots need to have the same length and order",
        cause: null,
        details: {
          leavesChains: leaves.map((v) => v.cps.getChainString()).join(" | "),
          leavesUnique: leaves.map((v) => v.cps.getUnique()).join(" | "),
          rootsChains: roots.map((v) => v.cps.getChainString()).join(" | "),
          leavesLength: leaves.length,
          rootsLength: roots.length,
        },
      });
    }
    for (let i = 0; i < leaves.length; i++) {
      if (roots[i] && leaves[i]) roots[i].setParent(leaves[i]);
      // leaves[i]
    }
    // leaves.forEach((l) => l.pushChild());
  }

  // private linkCps(): ISerializedNode[] {
  //   const cps = this.ownedTrnCps;
  //   const list: ISerializedNode[] = [];

  //   for (let i = cps.length; --i > 0; ) {
  //     const c = cps[i];
  //     if (i > 0) {
  //       cps[i - 1].pushChild(c);
  //     }
  //   }

  //   return list;
  // }

  private buildChildrenTrnCpx(): ISerializedNode[] {
    return this.childrenTrnCpx.map((v) => v.build()).flat();
  }

  // @ts-expect-error
  private buildOwnedCps(): ISerializedNode[] {
    // @ts-expect-error
    const cpx = this.buildChildrenTrnCpx();

    // this.childrenTrnCpx.forEach((x) => {
    //   this.ownedTrnCps.at(-1)!.pushChild(x);
    // });
    const root = this.ownedTrnCps[0].build();

    return root;
  }

  build(): ISerializedNode[] {
    // console.log(
    //   "cpx",
    //   this.cpx
    //     .getCpsList()
    //     .map((v) => v.getId())
    //     .join(" | "),
    // );
    // console.log("children", this.buildChildrenTrnCpx());
    // // const cps = this.cpx.getRootCps();
    // // const dqm = cps.getDqmConfig();
    // // const component = cps.getComponentConfig();
    // assertArrayNotEmpty(this.ownedTrnCps, {
    //   why: "Cpx should all have at least one cps",
    // });
    // return this.ownedTrnCps[0].build();
    // return this.buildOwnedCps();
    const cps = this.cpx.getCpsList()[0];
    return [
      {
        kind: "leaf",
        chain: ["debug", "leaf", "container"],
        dqm: cps.getDqmConfig(),
        component: cps.getComponentConfig(),
        source: "temp still",
      },
    ];
  }
}
