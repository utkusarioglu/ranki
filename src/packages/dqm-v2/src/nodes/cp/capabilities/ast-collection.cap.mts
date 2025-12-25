import type { IAstNode } from "@dqm/package-dqm-api-v2";
import { assertExists } from "@dqm/package-dqm-utils";

/**
 * TODO This is just a basic get-set thing. it could be grouped up with other
 * get-set sort of properties. In a map-like structure.
 */
export function astCollectionCapability<T>(self: T) {
  let rootAst: IAstNode;

  return {
    setRootAst(ast: IAstNode): T {
      rootAst = ast;
      return self;
    },

    getRootAst(): IAstNode {
      assertExists(rootAst, { why: "Root ast has to be defined" });
      return rootAst;
    },
  };
}
