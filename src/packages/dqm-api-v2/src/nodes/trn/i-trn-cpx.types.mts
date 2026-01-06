// import type {
//   CommonTransportsConstructorParams,
//   ICpx,
//   ISerializedNode,
//   ITrnCpsNode,
//   ITrnCpsRootNode,
// } from "../export.types.mjs";

// export interface ITrnCpxNode {
//   serialize(): ISerializedNode[];
//   getOwnedTrnCpsRootHead(): ITrnCpsNode;

//   pushChildTrnCpsRootNode(trnCps: ITrnCpsRootNode): this;

//   /**
//    * Calls transform on all of its children, dfs
//    */
//   transform(): this;
// }

// export type TrnCpxRegistry = WeakMap<ICpx, ITrnCpxNode>;

// export type ITrnCpxNodeConstructor = new (
//   cpx: ICpx,
//   registry: TrnCpxRegistry,
//   s: CommonTransportsConstructorParams,
// ) => ITrnCpxNode;
