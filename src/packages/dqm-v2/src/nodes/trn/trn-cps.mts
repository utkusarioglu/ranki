import type {
  AstSourceString,
  Chain,
  IAstNode,
  IAstNodeKind,
  ISerializedNode,
  ITrnCpsNode,
  ITrnCpsRootNode,
  TransformClass,
} from "@dqm/package-dqm-api-v2";
import { CommonTransports } from "../common-transports.mjs";
import { verticesCapability } from "../capabilities/vertices.capability.mjs";
import { assertNever } from "../../errors/dqm-app-error/assertions.mjs";
import { DqmAppError } from "../../errors/dqm-app-error/dqm-app-error.mjs";
import { rejectValues } from "@dqm/package-dqm-utils";

export class TrnCpsNode extends CommonTransports implements ITrnCpsNode {
  private root!: ITrnCpsRootNode;
  private vertices = verticesCapability<this, ITrnCpsNode>(this);
  private source!: AstSourceString;
  private kind: IAstNodeKind = "parent";
  public chain!: Chain;
  public transformClass!: TransformClass;

  setTransformClass(t: TransformClass): this {
    this.transformClass = t;
    return this;
  }

  getTransformClass(): TransformClass {
    return this.transformClass;
  }

  @rejectValues(undefined)
  getRoot() {
    return this.root;
  }

  serialize(): ISerializedNode[] {
    const root = this.getRoot();
    const component = root.getComponentConfig();
    const chain = this.getChain();
    const kind = this.getKind();
    switch (kind) {
      case "leaf":
        return [
          {
            kind,
            chain,
            // dqm,
            component,
            source: this.getSource(),
          },
        ];
      case "parent":
        const children = this.getChildren()
          .map((c) => c.serialize())
          .flat();
        return [
          {
            kind,
            chain,
            // dqm,
            component,
            children,
          },
        ];
      default:
        assertNever({ why: "All `kinds` should have been depleted" });
    }
  }

  setRoot(root: ITrnCpsRootNode): this {
    this.root = root;
    return this;
  }

  setChain(chain: Chain): this {
    this.chain = chain;
    return this;
  }

  getChain(): Chain {
    return this.chain;
  }

  getKind(): IAstNodeKind {
    return this.kind;
  }

  setSource(source: AstSourceString): this {
    this.kind = "leaf";
    this.source = source;
    return this;
  }

  getRootAst(): IAstNode {
    return this.getRoot().getRootAst();
  }

  newChild(): ITrnCpsNode {
    const root = this.getRoot();
    const transports = this.getTransports();
    const TrnCps = this.getPlugins().getTrnCpsNodeConstructor();
    const n = new TrnCps(transports);
    (n as TrnCpsNode).setParent(this).setRoot(root);

    return n;
  }

  transform(): ITrnCpsNode {
    // TODO call transform
    return this;
  }

  private getSource(): AstSourceString {
    return this.source;
  }

  // VERTICES
  pushChild(c: ITrnCpsNode): this {
    if (this.kind === "leaf") {
      throw new DqmAppError({
        code: "VALUE_DEFINED",
        why: "The node has already been marked as leaf, leaf nodes cannot have children",
        cause: null,
        details: {
          chain: this.getChain(),
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
