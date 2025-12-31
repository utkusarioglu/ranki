import type {
  Chain,
  CommonTransportsConstructorParams,
  DqmConfig,
  IAstNode,
  // ICpx,
} from "../../export.types.mjs";
import type { ISerializedNode } from "../ser/i-serialized.types.mjs";

// export type TfmHoist = number & { type?: "TransformHoist" };

export type ITrnNodeConstructor = new (
  // cpx: ICpx,
  ast: IAstNode,
  /**
   * I Cannot decide whether this should be [][] or just []. maybe it's useful
   * to be able to tell which child the package comes from.
   */
  // children: ITrnNode[][],
  t: CommonTransportsConstructorParams,
) => ITrnNode;

export interface ITrnNode {
  setChain(chain: Chain): this;

  getAst(): IAstNode;
  // getCps(): ICps;
  // getRootAst(): IAstNode;
  // setDirection(direction: ContentDirection): this;
  // setHoist(hoist: TfmHoist): this;

  getComponentConfig<T>(): T;
  getDqmConfig(): DqmConfig;

  /**
   * Read the node for the IAstNodeConstructor `children` arg
   */
  getDescendants(): ITrnNode[];
  pushChild(child: ITrnNode): this;

  /**
   * Should only be available if the node is a leaf
   */
  setSource(source: string): this;

  /**
   * Collapses the class to an object. this way it's going to be ready for the
   * render step.
   */
  build(): ISerializedNode[];

  /**
   * In case of hoist, this is going to be called to produce a replica of the
   * current node. which will can then be used to hoist the ELEMENT THAT COMES
   * BEFORE.
   */
  clone(): ITrnNode;

  newTrnNode(ast: IAstNode): ITrnNode;
}
