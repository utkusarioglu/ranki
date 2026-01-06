import type {
  IAstNode,
  ITrnNode,
  ITCpxNode,
  ITCpsNode,
  CommonTransportsConstructorParams,
  Chain,
  AstSourceString,
  ISerializedNode,
  IAstNodeKind,
} from "@dqm/package-dqm-api-v2";
import { edgeCapability } from "../capabilities/edge.capability.mjs";
import { CommonTransports } from "../common-transports.mjs";
import { assertExists, assertLeaf } from "@dqm/package-dqm-utils";
// @ts-expect-error
import { assertNever } from "../../errors/dqm-app-error/assertions.mjs";
import { DqmAppError } from "../../errors/dqm-app-error/dqm-app-error.mjs";

// @ts-ignore
const DUMMY_SERIALIZATION: ISerializedNode[] = [
  {
    kind: "leaf",
    chain: ["debug", "leaf", "container"],
    // @ts-expect-error
    dqm: {},
    component: {},
    source: "(temp trn serialization)",
  },
];

export class TrnNode extends CommonTransports implements ITrnNode {
  public readonly ast: IAstNode;
  public readonly tCpx: ITCpxNode;
  public readonly tCpsList: ITCpsNode[];
  // @ts-expect-error
  private selectTCps: ITCpsNode | null = null;
  private readonly trnV = edgeCapability<ITrnNode>(this, "Trn");
  // @ts-expect-error
  private chain!: Chain;
  // @ts-expect-error
  private source!: AstSourceString;
  private kind: IAstNodeKind = "parent";
  private slot!: ITrnNode;

  constructor(
    ast: IAstNode,
    tCpx: ITCpxNode,
    tCps: ITCpsNode[],
    s: CommonTransportsConstructorParams,
  ) {
    super(s);
    this.ast = ast;
    this.tCpx = tCpx;
    this.tCpsList = tCps;
  }

  setSlot(): this {
    this.slot = this;
    return this;
  }

  getSlot(): ITrnNode {
    const slots = [this.slot, ...this.getTrnEdges().map((v) => v.getSlot())];
    const kind = this.getKind();
    if (slots.length > 1) {
      throw new DqmAppError({
        code: "TOO_MANY",
        why: "Cannot have more than one slot in a transformer.",
        cause: null,
      });
    }
    if (kind === "leaf" && slots.length > 0) {
      throw new DqmAppError({
        code: "LEAF_SLOT",
        why: "Leaves cannot define slots",
        cause: null,
      });
    }
    return slots[0];
  }

  serialize(): ISerializedNode[] {
    return DUMMY_SERIALIZATION;
    // assertExists(this.chain, {
    //   why: "Chain needs to be set for every trn node",
    //   details: {
    //     astCreator: this.ast.getCreator(),
    //     tc: this.ast.getTransformClass(),
    //     chain: this.chain,
    //   },
    // });
    // assertExists(this.selectTCps, { why: "There needs to be a selected tcps" });
    // const kind = this.getKind();
    // const chain = this.chain;
    // const cps = this.selectTCps.cps;
    // const dqm = cps.getDqmConfig();
    // const component = cps.getComponentConfig();
    // switch (kind) {
    //   case "parent":
    //     const children = this.getTrnEdges()
    //       .map((v) => v.serialize())
    //       .flat();
    //     console.log(this.chain, children);
    //     return [
    //       {
    //         kind,
    //         chain,
    //         data: {
    //           dqm,
    //           component,
    //         },
    //         children,
    //       },
    //     ];
    //   case "leaf":
    //     assertExists(this.source, {
    //       why: "leaves need to have their source set",
    //     });
    //     return [
    //       {
    //         kind,
    //         chain,
    //         data: {
    //           dqm,
    //           component,
    //         },
    //         source: this.source,
    //       },
    //     ];
    //   default:
    //     assertNever({
    //       why: "Unrecognized `kind` encountered",
    //       details: { kind },
    //     });
    // }
  }

  /**
   * @dev
   * #1 TODO you need to select a different cps depending on the hoist setting here
   */
  transform(): this {
    const leafTCps = this.tCpsList.at(-1); // #1
    assertExists(leafTCps, { why: "At least one tcps needs to be defined" });
    this.selectTCps = leafTCps;
    // const cps = leafCps;
    const tc = this.ast.getTransformClass();
    assertExists(tc, {
      why: "TransformClass needs to be defined for transform to work",
    });
    const transformer = this.getPlugins().getTransformer(tc);
    transformer(this);
    return this;
  }

  getAst(): IAstNode {
    return this.ast;
  }

  // @writeOnce("chain")
  setChain(c: Chain): this {
    this.chain = c;
    return this;
  }

  getKind() {
    return this.kind;
  }

  newChild(): ITrnNode {
    assertLeaf(this, { why: "Leaf nodes cannot have children" });
    const TrnNode = this.getPlugins().getTrnNodeConstructor();
    const trn = new TrnNode(
      this.ast,
      this.tCpx,
      this.tCpsList,
      this.getTransports(),
    ).setTrnParent(this);
    return trn;
  }

  private switchToLeaf() {
    this.kind = "leaf";
  }

  setSource(s: AstSourceString): this {
    this.switchToLeaf();
    this.source = s;
    return this;
  }

  // TC
  getTransformClass = () => this.ast.getTransformClass();

  // VERTICES
  setTrnParent = this.trnV.setParent.bind(this.trnV);
  pushTrnEdge = this.trnV.pushEdge.bind(this.trnV);
  getTrnEdges = this.trnV.getEdges.bind(this.trnV);
}
