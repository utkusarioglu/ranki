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
  SerializedPackage,
  ISerializedParent,
  SerializeMethodParams,
  SerializationPropertiesUnion,
  ChainString,
} from "@dqm/package-dqm-api-v2";
import { edgeCapability } from "../capabilities/edge.capability.mjs";
import { CommonTransports } from "../common-transports.mjs";
import { assertExists, assertParent } from "@dqm/package-dqm-utils";
import { assertNever } from "../../errors/dqm-app-error/assertions.mjs";
import { DqmAppError } from "../../errors/dqm-app-error/dqm-app-error.mjs";
import { Hash } from "../../utils/hash.mjs";
import { CHAIN_STRING_SEPARATOR } from "../../constants.mjs";

export class TrnNode extends CommonTransports implements ITrnNode {
  public readonly ast: IAstNode;
  public readonly tCpx: ITCpxNode;
  public readonly tCps: ITCpsNode;
  public readonly tCpsList: ITCpsNode[];
  private readonly foreignTrn = edgeCapability<ITrnNode>(this, "ForeignTrn");
  private readonly localTrn = edgeCapability<ITrnNode>(this, "LocalTrn");
  private chain!: Chain;
  private source!: AstSourceString;
  private kind: IAstNodeKind = "parent";
  private isMount: boolean = false;
  private isLocalEdge: boolean = false;
  private serialized: SerializedPackage | null = null;

  constructor(
    ast: IAstNode,
    tCpx: ITCpxNode,
    tCps: ITCpsNode,
    tCpsList: ITCpsNode[],
    s: CommonTransportsConstructorParams,
  ) {
    super(s);
    this.ast = ast;
    this.tCpx = tCpx;
    this.tCps = tCps;
    this.tCpsList = tCpsList;
  }

  setAsMount() {
    this.isMount = true;
  }

  getIsMount(): boolean {
    return this.isMount;
  }

  private produceProps(p: SerializeMethodParams) {
    type Producers = Record<SerializationPropertiesUnion, () => any>;
    type PropsReturn = Record<SerializationPropertiesUnion, any>;
    const cps = this.tCps.cps;
    const producers: Producers = {
      astRootCreator: () => this.tCpx.cpx.getRootAst().getCreator(),
      chain: () => this.chain,
      component: () => cps.getComponentConfig(),
      dqm: () => cps.getDqmConfig(),
    };
    const data: Partial<PropsReturn> = {};
    p.props.forEach((k) => {
      data[k] = producers[k]();
    });
    return data;
  }

  serialize(p: SerializeMethodParams): SerializedPackage {
    assertExists(this.chain, {
      why: "Chain needs to be set for every trn node",
      details: {
        astCreator: this.ast.getCreator(),
        tc: this.ast.getTransformClass(),
        chain: this.chain,
      },
    });
    const kind = this.getKind();
    const chain = this.chain;
    const props = this.produceProps(p);
    switch (kind) {
      case "parent":
        this.serialized = this.serializeParent(chain, props, p);
        break;
      case "leaf":
        const source = this.getSource();
        assertExists(source, {
          why: "leaves need to have their source set",
        });
        const key = Hash.serialKey(chain, props, source);
        this.serialized = {
          serialized: [
            {
              kind,
              key,
              chain,
              props,
              source,
            },
          ],
        };
        break;
      default:
        assertNever({
          why: "Unrecognized `kind` encountered",
          details: { kind },
        });
    }
    return this.serialized;
  }

  private serializeParent(
    chain: Chain,
    props: ISerializedNode["props"],
    p: SerializeMethodParams,
  ) {
    const local = this.getLocalTrnEdges()
      .map((v) => v.serialize(p))
      .flat();

    const children = local.map((v) => v.serialized).flat();

    // const curr: ISerializedParent = {
    const pre: Omit<ISerializedParent, "key"> = {
      kind: "parent",
      // key: "",
      chain,
      props,
      children,
    };

    const mounts = [
      this.getIsMount()
        ? (v: ISerializedNode[]) => {
            v.forEach((a) => pre.children.push(a));
          }
        : undefined,
      ...local.map((v) => v.mount),
    ].filter((v) => v !== undefined);

    if (mounts.length > 1) {
      throw new DqmAppError({
        code: "MULTIPLE_MOUNTS",
        why: "Only a single mount can exist in a local trn tree",
        cause: null,
        details: {
          isMount: this.isMount,
          mounts,
        },
      });
    }
    const mountCb = mounts[0];

    if (this.isLocalEdge) {
      // FIX this is broken it doesn't properly produce keys. likely due to how
      // foreign nodes are binded. TODO this is repeated at the end of the
      // file. and that one is also broken
      const curr: ISerializedParent = {
        ...pre,
        key: Hash.serialKey(
          chain,
          props,
          pre.children.map((v) => v.key).join("-") || "no-child",
        ),
      };

      return {
        serialized: [curr],
        mount: mountCb,
      };
    }

    const foreign = this.getForeignTrnEdges()
      .map((v) => v.serialize(p))
      .flat();

    if (foreign.length) {
      assertExists(mountCb, {
        why: "Mount Cb has to be defined to mount foreign trn",
      });
      mountCb(foreign.map((f) => f.serialized).flat());
    }

    const curr: ISerializedParent = {
      ...pre,
      key: Hash.serialKey(
        chain,
        props,
        pre.children.map((v) => v.key).join("-") || "no-children",
      ),
    };

    return {
      serialized: [curr],
    };
  }

  /**
   * @dev
   * #1 TODO you need to select a different cps depending on the hoist setting here
   */
  async transform(): Promise<this> {
    if (!this.isLocalEdge) {
      this.getForeignTrnEdges().forEach((v) => v.transform());
    }

    const tc = this.ast.getTransformClass();
    assertExists(tc, {
      why: "TransformClass needs to be defined for transform to work",
    });
    const componentChain = this.tCps.cps.getChain();
    const transformer = this.getPlugins().getTransformer(componentChain, tc);
    await transformer(this);
    this.transformLocal();
    return this;
  }

  transformLocal() {
    this.getLocalTrnEdges().map((v) => (v as TrnNode).transformLocal());
  }

  getAst(): IAstNode {
    return this.ast;
  }

  // @writeOnce("chain")
  setChain(c: Chain): this {
    this.chain = c;
    return this;
  }

  getChainString(): ChainString {
    return this.chain.join(CHAIN_STRING_SEPARATOR);
  }

  getKind() {
    return this.kind;
  }

  newChild(): ITrnNode {
    assertParent(this, { why: "Leaf nodes cannot have children" });
    const TrnNode = this.getPlugins().getTrnNodeConstructor();
    const trn = new TrnNode(
      this.ast,
      this.tCpx,
      this.tCps,
      this.tCpsList,
      this.getTransports(),
    ).setLocalTrnParent(this);
    (trn as TrnNode).setAsLocalEdge();
    return trn;
  }

  setAsLocalEdge(): void {
    this.isLocalEdge = true;
  }

  private switchToLeaf() {
    this.kind = "leaf";
  }

  setSource(s: AstSourceString): this {
    this.switchToLeaf();
    this.source = s;
    return this;
  }

  getSource(): AstSourceString {
    return this.source;
  }

  // TC
  getTransformClass = () => this.ast.getTransformClass();

  // FOREIGN VERTICES
  setForeignTrnParent = this.foreignTrn.setParent.bind(this.foreignTrn);
  pushForeignTrnEdge = this.foreignTrn.pushEdge.bind(this.foreignTrn);
  getForeignTrnEdges = this.foreignTrn.getEdges.bind(this.foreignTrn);

  // FOREIGN VERTICES
  setLocalTrnParent = this.localTrn.setParent.bind(this.localTrn);
  pushLocalTrnEdge = this.localTrn.pushEdge.bind(this.localTrn);
  getLocalTrnEdges = this.localTrn.getEdges.bind(this.localTrn);
}
