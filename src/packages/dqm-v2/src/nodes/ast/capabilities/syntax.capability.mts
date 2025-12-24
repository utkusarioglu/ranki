import type {
  IAstNode,
  TokenNodes,
  SpaceNodes,
  SubtreeNodes,
  ChildrenNodes,
  PushedNodeDefinition,
  CreatorName,
  UniqueValue,
} from "@dqm/package-dqm-api-v2";
import { assertArrayNotEmpty } from "@dqm/package-dqm-utils";
import type * as ohm from "ohm-js";
import type { WorkedNodeDefinition } from "../ast-node.types.mjs";
import { prepareContext } from "../ast.utils.mjs";
import { DqmAppError } from "../../../errors/dqm-app-error/dqm-app-error.mjs";
import { assertExists } from "@dqm/package-dqm-utils";

/**
 * @dev
 * #1 It expects an IAstNode but the generic T doesn't extend IAstNode.
 * Extending it would cause some type issues but it's doable in the future.
 */
export function syntaxCapability<T>(self: T) {
  const allNodes: IAstNode[] = [];
  const tokenNodes: TokenNodes = [];
  const spaceNodes: SpaceNodes = [];
  const subtreeNodes: SubtreeNodes = [];
  const childrenNodes: ChildrenNodes = [];
  const ignoredNodes: ohm.Node[] = [];

  return {
    /**
     * @dev
     * #1 The check for leafDecoder relates to only leaves being able to define a
     * decoder. If a decoder is defined, the node shouldn't be able to become a
     * parent. Which means, pushing nodes to the node shouldn't be possible.
     *
     * #2 This is experimental. The aim is to see if the `subtree` and `child`
     * distinction can be made through the unique id of CPS
     * */
    // @dependsOn("kind")
    pushNodes(nodeSetRaw: PushedNodeDefinition[], cpxUnique: UniqueValue): T {
      assertArrayNotEmpty(nodeSetRaw, {
        why: "Empty array would mean a redundant push call",
        details: { method: "pushNodes" },
      });

      const areIter = nodeSetRaw.map((n) => n[1].isIteration());
      const isIter = areIter.some((v) => v === true);
      const inconsistentIter = isIter && areIter.some((v) => v !== true);
      if (inconsistentIter) {
        throw new DqmAppError({
          code: "INCONSISTENT_ITERATOR_NODES",
          why: "Given nodes need to have the same iteration status",
          cause: null,
          details: {
            nodeSetRaw,
            areIter,
          },
        });
      }
      const nodeSet: WorkedNodeDefinition[] = isIter
        ? nodeSetRaw.map(([relationship, nodes]) => [
            relationship,
            nodes.children,
          ])
        : nodeSetRaw.map(([relationship, nodes]) => [relationship, [nodes]]);

      if (nodeSet.some(([_, nodes]) => nodes.length !== nodeSet[0][1].length)) {
        throw new DqmAppError({
          code: "INCONSISTENT_ZIP_MEMBER_HEIGHTS",
          why: "Given arrays have different lengths and cannot be zipped",
          cause: null,
          details: { nodeSet },
        });
      }
      // @ts-expect-error #1
      const context = prepareContext(self);

      [...Array.from(nodeSet[0][1].keys())].forEach((i) => {
        nodeSet.forEach(([relationship, nodes]) => {
          let method;
          switch (relationship) {
            case "node":
              // #2
              // case "child":
              // case "subtree":
              method = "node";
              break;
            default:
              method = relationship;
          }
          const parsedRaw = nodes[i][method](context) as IAstNode | IAstNode[];
          const parsedList = Array.isArray(parsedRaw) ? parsedRaw : [parsedRaw];
          parsedList.forEach((parsed) => {
            parsed.setRelationship(relationship).setCreationMethod(method);
            if (allNodes.length) {
              const prevNode = allNodes.at(-1)!;
              parsed.setPrev(prevNode);
              prevNode.setNext(parsed);
            }
            allNodes.push(parsed);
            switch (relationship) {
              case "node":
                const cpx = parsed.getCpx();
                assertExists(cpx, {
                  why: "Cpx should be available in this point in the code",
                });
                if (cpxUnique === cpx.getUnique()) {
                  subtreeNodes.push(parsed);
                } else {
                  childrenNodes.push(parsed);
                }
                break;
              case "space":
                spaceNodes.push(parsed);
                break;
              case "token":
                tokenNodes.push(parsed);
            }
          });
        });
      });
      return self;
    },

    pushOrderNode(n: IAstNode): T {
      allNodes.push(n);
      return self;
    },

    findSubtreeNodeByCreator(c: CreatorName): IAstNode {
      return subtreeNodes.find((n) => n.getCreator() === c)!;
    },

    findTokenNodeByCreator(c: CreatorName): IAstNode {
      return tokenNodes.find((n) => n.getCreator() === c)!;
    },

    findSpaceNodeByCreator(c: CreatorName): IAstNode {
      return spaceNodes.find((n) => n.getCreator() === c)!;
    },

    getSubtreeNodes(): IAstNode[] {
      return subtreeNodes;
    },

    getChildrenNodes(): IAstNode[] {
      return childrenNodes;
    },

    pushIgnoredNodes(...nodes: ohm.Node[]): T {
      ignoredNodes.push(...nodes);
      return self;
    },

    getIgnoredNodes(): ohm.Node[] {
      return ignoredNodes;
    },

    getTokenNodes(): TokenNodes {
      return tokenNodes;
    },

    getSpaceNodes(): SpaceNodes {
      return spaceNodes;
    },

    getAllNodes(): IAstNode[] {
      return allNodes;
    },
  };
}
