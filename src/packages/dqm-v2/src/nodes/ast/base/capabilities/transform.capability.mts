import type {
  TransformClass,
  TransformClassDict,
} from "@dqm/package-dqm-api-v2";
import { DqmAppError } from "../../../../errors/dqm-app-error/dqm-app-error.mjs";
import { assertExists } from "@dqm/package-dqm-utils";

function insertOne<Stored>(
  a: TransformClassDict<Stored>,
  tc: TransformClass,
  node: Stored,
) {
  if (a.has(tc)) {
    throw new DqmAppError({
      code: "VALUE_EXISTS",
      why: "transform class entries need to be unique",
      cause: null,
      details: {
        nonUniqueTransformClass: tc,
      },
    });
  }
  a.set(tc, node);
}

export function transformClassCapability<
  T,
  Dict extends TransformClassDict<any>,
>(self: T) {
  type Stored = T;
  // type Dict = TransformClassDict<Stored>;
  let transformClass: TransformClass | null = null;

  return {
    setTransformClass(tc: TransformClass): Stored {
      transformClass = tc;
      return self;
    },
    getTransformClass(): TransformClass {
      assertExists(transformClass, {
        why: "TransformClass called before being defined. Did you set the related transform class in ast?",
      });
      return transformClass;
    },
    getChildrenTransformClassDict(subtree: Stored[]): Dict {
      const sub = subtree.map((v) =>
        // @ts-expect-error
        v.collectTransformClasses(),
      );
      const merged: Dict = sub.reduce((a, c) => {
        // @ts-expect-error
        c.entries().forEach(([tc, node]) => {
          insertOne(a, tc, node);
        });
        return a;
      }, new Map() as Dict);
      return merged;
    },
    getTransformClassDict(subtree: Stored[]): Dict {
      const merged = this.getChildrenTransformClassDict(subtree);

      if (transformClass) {
        insertOne(merged, transformClass, self);
      }

      return merged;
    },
  };
}
