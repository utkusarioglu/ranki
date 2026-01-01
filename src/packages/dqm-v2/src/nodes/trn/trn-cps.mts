import type {
  AstSourceString,
  CommonTransportsConstructorParams,
  IAstNodeKind,
  ICps,
  ISerializedNode,
  ITrnCpsNode,
} from "@dqm/package-dqm-api-v2";
import { CommonTransports } from "../common-transports.mjs";
import { verticesCapability } from "../capabilities/vertices.capability.mjs";
import { assertNever } from "../../errors/dqm-app-error/assertions.mjs";
import { DqmAppError } from "../../errors/dqm-app-error/dqm-app-error.mjs";

export class TrnCpsNode extends CommonTransports implements ITrnCpsNode {
  private vertices = verticesCapability<this, ITrnCpsNode>(this);
  public readonly cps;
  private source!: AstSourceString;
  private kind: IAstNodeKind = "parent";
  // public readonly cpsChildren: ITrnCpsNode[] = [];

  constructor(cps: ICps, s: CommonTransportsConstructorParams) {
    super(s);
    this.cps = cps;
    this.cps.getTransformer()(this);
  }

  getKind(): IAstNodeKind {
    return this.kind;
  }

  setSource(source: AstSourceString): this {
    // if (this.kind === "parent") {
    //   throw new DqmAppError({
    //     code: "VALUE_DEFINED",
    //     why: "The node has already been marked as parent, parent nodes cannot have source strings",
    //     cause: null,
    //     details: {
    //       chain: this.cps.getChain(),
    //     },
    //   });
    // }
    this.kind = "leaf";
    this.source = source;
    return this;
  }

  newTrnCpsNode(): ITrnCpsNode {
    const transports = this.getTransports();
    const TrnCps = this.getPlugins().getTrnCpsNodeConstructor();
    const n = new TrnCps(this.cps, transports);
    n.setParent(this);
    this.pushChild(n);

    return n;
  }

  private getSource(): AstSourceString {
    return this.source;
  }

  build(): ISerializedNode[] {
    const kind = this.kind;
    const dqm = this.cps.getDqmConfig();
    const component = this.cps.getComponentConfig();
    switch (kind) {
      case "leaf":
        return [
          {
            kind,
            chain: ["debug", "leaf", "container"],
            source: this.getSource(),
            dqm,
            component,
          },
        ];
      case "parent":
        return [
          {
            kind,
            dqm,
            component,
            chain: ["debug", "block", "container"],
            children: this.getChildren()
              .map((v) => v.build())
              .flat(),
          },
        ];
      default:
        assertNever({
          why: "All possible `kind` paths should have been depleted",
        });
    }
  }

  // VERTICES
  pushChild(c: ITrnCpsNode): this {
    if (this.kind === "leaf") {
      throw new DqmAppError({
        code: "VALUE_DEFINED",
        why: "The node has already been marked as leaf, leaf nodes cannot have children",
        cause: null,
        details: {
          chain: this.cps.getChain(),
        },
      });
    }
    this.kind = "parent";
    this.vertices.pushChild(c);
    return this;
  }

  setParent = this.vertices.setParent.bind(this.vertices);
  getParent = this.vertices.getParent.bind(this.vertices);
  getNext = this.vertices.getNext.bind(this.vertices);
  getPrev = this.vertices.getPrev.bind(this.vertices);
  setPrev = this.vertices.setPrev.bind(this.vertices);
  setNext = this.vertices.setNext.bind(this.vertices);
  getChildren = this.vertices.getChildren.bind(this.vertices);
}
