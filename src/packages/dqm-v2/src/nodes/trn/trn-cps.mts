// import type {
//   AstSourceString,
//   Chain,
//   IAstNode,
//   IAstNodeKind,
//   ISerializedNode,
//   ITrnCpsNode,
//   ITrnCpsRootNode,
//   TransformClass,
//   TransformClassDict,
// } from "@dqm/package-dqm-api-v2";
// import { CommonTransports } from "../common-transports.mjs";
// import { verticesCapability } from "../capabilities/vertices.capability.mjs";
// import { assertNever } from "../../errors/dqm-app-error/assertions.mjs";
// import { DqmAppError } from "../../errors/dqm-app-error/dqm-app-error.mjs";
// import { assertExists, rejectValues } from "@dqm/package-dqm-utils";
// import { transformClassCapability } from "../ast/base/capabilities/transform.capability.mjs";

// type ITcpsDict = TransformClassDict<ITrnCpsNode>;
// type AstDict = TransformClassDict<IAstNode>;

// export class TrnCpsNode extends CommonTransports implements ITrnCpsNode {
//   private readonly vertices = verticesCapability<this, ITrnCpsNode>(this);
//   // @ts-ignore
//   private readonly acceptedTc = transformClassCapability<
//     ITrnCpsNode,
//     ITcpsDict
//   >(this);
//   public ast: IAstNode | null = null;
//   private root!: ITrnCpsRootNode;
//   private source!: AstSourceString;
//   private kind: IAstNodeKind = "parent";
//   public chain!: Chain;

//   collectTransformClasses(): ITcpsDict {
//     const subtree = this.getChildren();
//     return this.acceptedTc.getTransformClassDict(subtree);
//   }

//   // @ts-ignore
//   setTransformClass = this.acceptedTc.setTransformClass.bind(this.acceptedTc);
//   // @ts-ignore
//   getTransformClass = this.acceptedTc.getTransformClass.bind(this.acceptedTc);

//   getChildrenTransformClassDict(): [TransformClass, ITrnCpsNode] | null {
//     const children = this.getChildren();
//     const map = this.acceptedTc.getChildrenTransformClassDict(children);
//     if (map.size === 0) {
//       return null;
//       // throw new DqmAppError({
//       //   code: "VALUE_DEFINED",
//       //   why: "Parent Tcps nodes need to have have a non-empty transform class dicts",
//       //   cause: null,
//       // });
//     } else if (map.size > 1) {
//       throw new DqmAppError({
//         code: "TOO_MANY",
//         why: "Tcps need to have a one-to-one relationship with acceptedTcs you need to split this transformer into many",
//         cause: null,
//       });
//     } else {
//       return map.entries().next().value!;
//     }
//   }

//   transform(tcs: AstDict, tc: TransformClass): this {
//     const ast = tcs.get(tc);
//     assertExists(ast, {
//       why: "Ast graph defines no TransformClass entry required during cps transform",
//       details: {
//         transformClass: tc,
//         TransformClassDict: Object.fromEntries(
//           tcs.entries().map(([k, v]) => [k, v.getCreator()]),
//         ),
//       },
//     });
//     this.setAst(ast);
//     const cpsTransform = this.getPlugins().getTransformer(tc);
//     cpsTransform(this);
//     const kind = this.getKind();
//     switch (kind) {
//       case "parent":
//         const dict = this.getChildrenTransformClassDict();
//         if (dict === null) {
//           // console.log("null reached", this.getChain());
//           return this;
//         }
//         const [childTc, node] = dict;
//         // @ts-ignore
//         // console.log(childTc, tcs[childTc]!.getCreator());
//         node.transform(tcs, childTc);
//         break;
//       case "leaf":
//         const source = this.getSource();
//         assertExists(source, { why: "leaves need to define source" });
//         break;
//       default:
//         assertNever({ why: "All `kind` options have been depleted" });
//     }
//     return this;
//   }

//   setAst(ast: IAstNode): this {
//     this.ast = ast;
//     return this;
//   }

//   getAst(): IAstNode {
//     assertExists(this.ast, {
//       why: "Ast needs to be set for every TrnCps node",
//     });
//     return this.ast;
//   }

//   @rejectValues(undefined)
//   getRoot() {
//     return this.root;
//   }

//   serialize(): ISerializedNode[] {
//     const root = this.getRoot();
//     const data = {
//       component: root.getComponentConfig(),
//       dqm: root.getDqmConfig(),
//     };
//     const chain = this.getChain();
//     const kind = this.getKind();
//     switch (kind) {
//       case "leaf":
//         return [
//           {
//             kind,
//             chain,
//             data,
//             source: this.getSource(),
//           },
//         ];
//       case "parent":
//         const children = this.getChildren()
//           .map((c) => c.serialize())
//           .flat();
//         return [
//           {
//             kind,
//             chain,
//             data,
//             children,
//           },
//         ];
//       default:
//         assertNever({ why: "All `kinds` should have been depleted" });
//     }
//   }

//   setRoot(root: ITrnCpsRootNode): this {
//     this.root = root;
//     return this;
//   }

//   setChain(chain: Chain): this {
//     this.chain = chain;
//     return this;
//   }

//   getChain(): Chain {
//     return this.chain;
//   }

//   getKind(): IAstNodeKind {
//     return this.kind;
//   }

//   setSource(source: AstSourceString): this {
//     this.kind = "leaf";
//     this.source = source;
//     return this;
//   }

//   newChild(): ITrnCpsNode {
//     const root = this.getRoot();
//     const transports = this.getTransports();
//     const TrnCps = this.getPlugins().getTrnCpsNodeConstructor();
//     const n = new TrnCps(transports);
//     (n as TrnCpsNode).setParent(this).setRoot(root);

//     return n;
//   }

//   private getSource(): AstSourceString {
//     return this.source;
//   }

//   // VERTICES
//   pushChild(c: ITrnCpsNode): this {
//     if (this.kind === "leaf") {
//       throw new DqmAppError({
//         code: "VALUE_DEFINED",
//         why: "The node has already been marked as leaf, leaf nodes cannot have children",
//         cause: null,
//         details: {
//           chain: this.getChain(),
//         },
//       });
//     }
//     this.kind = "parent";
//     this.vertices.pushChild(c);
//     return this;
//   }

//   setParent = this.vertices.setParent.bind(this.vertices);
//   getParent = this.vertices.getParent.bind(this.vertices);
//   getNext = this.vertices.getNext.bind(this.vertices);
//   getPrev = this.vertices.getPrev.bind(this.vertices);
//   setPrev = this.vertices.setPrev.bind(this.vertices);
//   setNext = this.vertices.setNext.bind(this.vertices);
//   getChildren = this.vertices.getChildren.bind(this.vertices);
// }
