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
} from "@dqm/package-dqm-api-v2";
import { edgeCapability } from "../capabilities/edge.capability.mjs";
import { CommonTransports } from "../common-transports.mjs";
import { assertExists, assertParent } from "@dqm/package-dqm-utils";
import { assertNever } from "../../errors/dqm-app-error/assertions.mjs";
import { DqmAppError } from "../../errors/dqm-app-error/dqm-app-error.mjs";

export class TrnNode extends CommonTransports implements ITrnNode {
  public readonly ast: IAstNode;
  public readonly tCpx: ITCpxNode;
  public readonly tCpsList: ITCpsNode[];
  private readonly foreignTrn = edgeCapability<ITrnNode>(this, "ForeignTrn");
  private readonly localTrn = edgeCapability<ITrnNode>(this, "LocalTrn");
  private selectTCps: ITCpsNode | null = null;
  private chain!: Chain;
  private source!: AstSourceString;
  private kind: IAstNodeKind = "parent";
  private isMount: boolean = false;
  private isLocalEdge: boolean = false;
  private serialized: SerializedPackage | null = null;

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

  setAsMount() {
    this.isMount = true;
  }

  private produceProps(p: SerializeMethodParams) {
    type Producers = Record<SerializationPropertiesUnion, () => any>;
    type PropsReturn = Record<SerializationPropertiesUnion, any>;
    assertExists(this.selectTCps, { why: "There needs to be a selected tcps" });
    const cps = this.selectTCps.cps;
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
        assertExists(this.source, {
          why: "leaves need to have their source set",
        });
        this.serialized = {
          serialized: [
            {
              kind,
              chain,
              props,
              source: this.source,
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

    const curr: ISerializedParent = {
      kind: "parent",
      chain,
      props,
      children: local.map((v) => v.serialized).flat(),
    };

    const mounts = [
      this.isMount
        ? (v: ISerializedNode[]) => {
            v.forEach((a) => curr.children.push(a));
          }
        : undefined,
      ...local.map((v) => v.mount),
    ].filter((v) => v !== undefined);

    if (mounts.length > 1) {
      console.log(
        this.chain,
        mounts,
        local,
        this.getLocalTrnEdges().map((v) => v.ast.getSourceString()),
      );
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
      return {
        serialized: [curr],
        mount: mountCb,
      };
    }

    const foreign = this.getForeignTrnEdges()
      .map((v) => v.serialize(p))
      .flat();

    if (foreign.length > 0 && mountCb === undefined) {
      throw new DqmAppError({
        code: "NO_MOUNT",
        why: "Trn Node has foreign children but offers no mount for them",
        cause: null,
      });
    }
    assertExists(mountCb, {
      why: "Mount Cb has to be defined to mount foreign trn",
    });
    mountCb(foreign.map((f) => f.serialized).flat());
    return {
      serialized: [curr],
    };
  }

  /**
   * @dev
   * #1 TODO you need to select a different cps depending on the hoist setting here
   */
  transform(): this {
    if (!this.isLocalEdge) {
      this.getForeignTrnEdges().map((v) => v.transform());
    }

    const leafTCps = this.tCpsList.at(-1); // #1
    assertExists(leafTCps, { why: "At least one tCps needs to be defined" });
    this.selectTCps = leafTCps;
    const tc = this.ast.getTransformClass();
    assertExists(tc, {
      why: "TransformClass needs to be defined for transform to work",
    });
    const componentChain = this.selectTCps.cps.getChain();
    const transformer = this.getPlugins().getTransformer(componentChain, tc);
    transformer(this);
    this.transformLocal(this.selectTCps);
    return this;
  }

  transformLocal(s: ITCpsNode) {
    this.selectTCps = s;
    this.getLocalTrnEdges().map((v) => (v as TrnNode).transformLocal(s));
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
    assertParent(this, { why: "Leaf nodes cannot have children" });
    const TrnNode = this.getPlugins().getTrnNodeConstructor();
    const trn = new TrnNode(
      this.ast,
      this.tCpx,
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
