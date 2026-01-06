// export type IVerticesCapability<T, N extends string> = {
//   [K in `get${N}Prev`]: () => T | null;
// };

// O: Host object type
// T : Collection
// N: Collection Name
// M: Method

/**
 * Generic type for the setters and getters for multiple edges.
 *
 * @param Host: The host class. This is used to imitate `return this`
 *
 * @param Collection: The target object for the edge. If the collected edge is of type
 * IAst, this is what that sets.
 *
 * @param CollectionName: What name the host object gives the collected objects. A
 * Node may collect IAst nodes as both children and subtree. Use an `ClassCase`
 * name. This is used in the created method names. If this value is "Subtree"
 * the methods will have the names `getSubtreeNext` `setSubtreeNext` and alike.
 */
export type IEdgeCapability<
  Host,
  Collection,
  CollectionName extends string,
  MethodsUnion extends keyof IEdgeAllCapability<
    Host,
    Collection,
    CollectionName
  >,
> = Pick<IEdgeAllCapability<Host, Collection, CollectionName>, MethodsUnion>;

type IEdgeAllCapability<H, T, N extends string> =
  //
  GetParent<T, N> &
    SetParent<H, T, N> &
    GetPrev<T, N> &
    SetPrev<H, T, N> &
    GetNext<T, N> &
    SetNext<H, T, N> &
    GetEdges<T, N> &
    PushEdge<H, T, N>;

type SetParent<H, T, N extends string> = {
  [K in `set${N}Parent`]: (parent: T | null, bidirectional?: boolean) => H;
};

type SetPrev<H, T, N extends string> = {
  [K in `set${N}Prev`]: (prev: T | null, bidirectional?: boolean) => H;
};

type GetParent<T, N extends string> = {
  [K in `get${N}Parent`]: () => T | null;
};

type GetPrev<T, N extends string> = {
  [K in `get${N}Prev`]: () => T | null;
};

type SetNext<H, T, N extends string> = {
  [K in `set${N}Prev`]: (prev: T | null) => H;
};

type GetNext<T, N extends string> = {
  [K in `get${N}Prev`]: () => T | null;
};

type PushEdge<H, T, N extends string> = {
  [K in `push${N}Edge`]: (edge: T) => H;
};

type GetEdges<T, N extends string> = {
  [K in `get${N}Edges`]: () => T[];
};

// interface ICatDog
//   extends IEdgeCapability<ICatDog, ICatDog, "Cat" | "Dog", "getCatEdges"> {}

// class CatDog implements ICatDog {
//   // getCatParent(): ICatDog | null {
//   //   return null;
//   // }

//   // setCatParent(p: ICatDog | null, bidirectional: boolean = true): ICatDog {
//   //   console.log(p, bidirectional);
//   //   return this;
//   // }

//   // getDogParent(): ICatDog | null {
//   //   return null;
//   // }

//   // setDogParent(p: ICatDog | null, bidirectional: boolean = true): ICatDog {
//   //   console.log(p, bidirectional);
//   //   return this;
//   // }

//   getCatEdges(): ICatDog[] {
//     return [];
//   }
// }
