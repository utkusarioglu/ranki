import type {
  IdUnique,
  CreatorName,
  AstSourceString,
  AstSourceView,
  IAstNodeKind,
  CreationMethod,
  CounterStat,
  DqmParseTheater,
  DqmParseOutput,
} from "@dqm/package-dqm-api-v2";
import type { IAstNode } from "@dqm/package-dqm-api-v2";
import type { SanitizedNodeView } from "./ast-view.store.types.mts";
import type { ParseResult } from "../dqm/dqm.store.types.mts";

export type SanitizedAst = {
  theater: DqmParseTheater;
  sanitized: SanitizedNodePartial;
};

export type SanitizedNodePartial = {
  key: string;
  fields: {
    props: Partial<SanitizedNodeProps>;
    children: Partial<SanitizedNodeChildren>;
    stable: Partial<SanitizedNodeStable>;
  };
};

export interface SanitizedNodeProps {
  creator: CreatorName;
  idList: string;
  kind: IAstNodeKind;
  constructorName: string;
  cpxUnique: IdUnique;
  childIndex: CounterStat;
  blockDepth: CounterStat;
  inlineDepth: CounterStat;
  chainList: string;
  childCount: number;
  ignoredCount: number;
  subtreeCount: number;
  meaning: string | undefined;
  creationMethod: CreationMethod;
}

export interface SanitizedNodeChildren {
  subtreeNodes: SanitizedNodePartial[];
  childrenNodes: SanitizedNodePartial[];
  tokenNodes: SanitizedNodePartial[];
  spaceNodes: SanitizedNodePartial[];
}

export interface SanitizedNodeStable {
  source: AstSourceString | AstSourceView<any>;
}

interface SanitizedNodeViewPreferences {
  props: (keyof SanitizedNodeProps)[];
  children: (keyof SanitizedNodeChildren)[];
  stable: (keyof SanitizedNodeStable)[];
}

export class SanitizedAstNode {
  private node: IAstNode;
  private visible: SanitizedNodeViewPreferences;

  constructor(node: IAstNode, visible: SanitizedNodeViewPreferences) {
    this.node = node;
    this.visible = visible;
  }

  build(): SanitizedNodePartial {
    const props = this.getProps();
    const children = this.getChildren();
    const stable = this.getStable();

    const fields = {
      props,
      children,
      stable,
    };

    return {
      // TODO this is very bad
      key: JSON.stringify([
        this.visible.children,
        this.visible.props,
        this.visible.stable,
      ]),
      fields,
    };
  }

  private getStable(): Partial<SanitizedNodeStable> {
    const stable: Partial<SanitizedNodeStable> = {};
    this.visible.stable.forEach((id) => {
      switch (id) {
        case "source":
          stable[id] =
            this.node.getKind() === "leaf"
              ? this.node.getLeafView()
              : {
                  type: "string",
                  raw: this.node.getSourceString(),
                };
          break;
        default:
          throw new Error(`Unrecognized sanitize feature: ${id}`);
      }
    });
    return stable;
  }

  private getChildren(): Partial<SanitizedNodeChildren> {
    const children: Partial<SanitizedNodeChildren> = {};
    this.visible.children.forEach((id) => {
      switch (id) {
        case "childrenNodes":
          const childrenNodes = this.node
            .getChildrenNodes()
            .map((n) => new SanitizedAstNode(n, this.visible).build());
          // .map((n) => sanitizeAstSingle(n, features));
          if (childrenNodes.length) {
            children[id] = childrenNodes;
          }
          break;
        case "subtreeNodes":
          const subtreeNodes = this.node
            .getSubtreeNodes()
            .map((n) => new SanitizedAstNode(n, this.visible).build());
          if (subtreeNodes.length) {
            children[id] = subtreeNodes;
          }
          break;
        case "tokenNodes":
          const tokenNodes = this.node
            .getTokenNodes()
            .map((n) => new SanitizedAstNode(n, this.visible).build());
          if (tokenNodes.length) {
            children[id] = tokenNodes;
          }
          break;
        case "spaceNodes":
          const spaceNodes = this.node
            .getSpaceNodes()
            .map((n) => new SanitizedAstNode(n, this.visible).build());
          if (spaceNodes.length) {
            children[id] = spaceNodes;
          }
          break;
      }
    });
    return children;
  }

  private getProps() {
    const props: Partial<SanitizedNodeProps> = {};
    this.visible.props.forEach((id) => {
      switch (id) {
        case "inlineDepth":
          props[id] = this.node.getInlineDepth();
          break;
        case "blockDepth":
          props[id] = this.node.getBlockDepth();
          break;
        case "childIndex":
          props[id] = this.node.getChildIndex();
          break;
        case "meaning":
          try {
            props[id] = this.node.getMeaning();
          } catch {}
          break;
        case "constructorName":
          props[id] = this.node.constructor.name;
          break;
        case "creationMethod":
          props[id] = this.node.getCreationMethod();
          break;
        case "ignoredCount":
          props[id] = this.node.getIgnoredNodes().length;
          break;
        case "kind":
          props[id] = this.node.getKind();
          break;
        case "subtreeCount":
          props[id] = this.node.getSubtreeNodes().length;
          break;
        case "childCount":
          props[id] = this.node.getChildrenNodes().length;
          break;
        case "cpxUnique":
          props[id] = this.node.getCpx().getId().getUnique();
          break;
        case "creator":
          props[id] = this.node.getCreator();
          break;
        case "idList":
          props[id] = this.node
            .getCpx()
            .getIdList()
            .map((v) => v.join("."))
            .join(" | ");
          break;
        case "chainList":
          props[id] = this.node
            .getCpx()
            .getChainList()
            .map((v) => v.join("."))
            .join(" | ");
          break;
      }
    });
    return props;
  }
}

function sanitizeAst(
  parsed: DqmParseOutput,
  features: SanitizedNodeViewPreferences,
): SanitizedAst[] {
  return parsed.map((p) => ({
    theater: p.theater,
    sanitized: new SanitizedAstNode(p.ast, features).build(),
  }));
}

export function createSanitized(
  parsed: ParseResult,
  visible: SanitizedNodeView,
): SanitizeResult {
  try {
    if (parsed.state !== "success") {
      return {
        state: "fail",
        error: parsed.error,
      };
    }
    const filteredIds = filterIds(visible);
    const sanitized = sanitizeAst(parsed.data, filteredIds);
    return {
      state: "success",
      data: {
        // parsed: parsed.data,
        sanitized,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      state: "fail",
      error: e as any,
    };
  }
}

function filterIds(all: SanitizedNodeView): SanitizedNodeViewPreferences {
  // @ts-expect-error
  return Object.fromEntries(
    Object.entries(all).map(([k, v]) => {
      // @ts-expect-error
      const b = v.filter((l) => l.visible).map((v) => v.id);

      return [k, b];
    }),
  );
}

export interface SuccessfulSanitize {
  // parsed: DqmParseOutput;
  sanitized: SanitizedAst[];
}

interface SanitizeResultSuccess {
  state: "success";
  data: SuccessfulSanitize;
}

interface SanitizeResultFail {
  state: "fail";
  error: string;
}

export type SanitizeResult = SanitizeResultSuccess | SanitizeResultFail;
