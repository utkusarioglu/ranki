import type {
  CommonTransportsConstructorParams,
  ICpx,
  ISerializedNode,
  ITrnCpsRootNode,
  ITrnCpxNode,
  TrnCpxRegistry,
} from "@dqm/package-dqm-api-v2";
import { CommonTransports } from "../common-transports.mjs";
import { rejectValues } from "@dqm/package-dqm-utils";
import { assertExists } from "@dqm/package-dqm-utils";

export class TrnCpxNode extends CommonTransports implements ITrnCpxNode {
  public readonly cpx;
  public readonly childrenTrnCpx: ITrnCpxNode[] = [];
  public readonly ownedTrnCpsRoot: ITrnCpsRootNode[] = [];
  private registry: TrnCpxRegistry;

  constructor(
    cpx: ICpx,
    registry: TrnCpxRegistry,
    s: CommonTransportsConstructorParams,
  ) {
    super(s);
    this.cpx = cpx;
    this.registry = registry;
    this.registry.set(cpx, this);
    this.initChildrenTrnCpx();
  }

  private getCpx(): ICpx {
    return this.cpx;
  }

  transform(): this {
    this.getChildrenTrnCpx().forEach((c) => c.transform());
    const ast = this.getCpx().getRootAst();
    const tcs = ast.collectTransformClasses();
    const tc = ast.getTransformClass();
    assertExists(tc, {
      why: "Transform class for the root ast node needs to be defined",
    });
    this.getOwnedTrnCpsRootHead().transform(tcs, tc);
    return this;
  }

  private getChildrenTrnCpx(): ITrnCpxNode[] {
    return this.childrenTrnCpx;
  }

  pushChildTrnCpsRootNode(trnCps: ITrnCpsRootNode): this {
    this.ownedTrnCpsRoot.push(trnCps);
    return this;
  }

  @rejectValues(undefined)
  getOwnedTrnCpsRootHead(): ITrnCpsRootNode {
    return this.ownedTrnCpsRoot[0];
  }

  private initChildrenTrnCpx() {
    const transports = this.getTransports();
    const TrnCpx = this.getPlugins().getTrnCpxNodeConstructor();
    this.cpx
      .getChildren()
      .forEach((c) =>
        this.childrenTrnCpx.push(new TrnCpx(c, this.registry, transports)),
      );
  }

  serialize(): ISerializedNode[] {
    // this.getChildrenTrnCpx().forEach((c) => c.serialize());
    return this.getOwnedTrnCpsRootHead().serialize().flat();
    // return [
    //   {
    //     kind: "leaf",
    //     chain: ["debug", "leaf", "container"],
    //     // @ts-expect-error
    //     dqm: {},
    //     component: {},
    //     source: "temp still",
    //   },
    // ];
  }
}
