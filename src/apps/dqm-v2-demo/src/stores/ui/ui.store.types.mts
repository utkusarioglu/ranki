import type { N } from "_displays/graph/build-elements/build.types.mjs";
import type {
  IAstNode,
  IAstParamNode,
  ICps,
  ICpsParam,
  ICpx,
} from "@dqm/package-dqm-api-v2";
import type { ClassSanitizer } from "@dqm/package-dqm-v2-debug";

export type AppState = "error" | "init" | "loaded" | "loading" | "timeout";

export type GraphDrawerAst = {
  cyNode: N;
  sanitizedDqmNode: ClassSanitizer<IAstNode>;
  type: "Ast";
};

export type GraphDrawerAstParam = {
  cyNode: N;
  sanitizedDqmNode: ClassSanitizer<IAstParamNode>;
  type: "AstParam";
};
export type GraphDrawerCps = {
  cyNode: N;
  sanitizedDqmNode: ClassSanitizer<ICps>;
  type: "Cps";
};

export type GraphDrawerCpsParam = {
  cyNode: N;
  sanitizedDqmNode: ClassSanitizer<ICpsParam>;
  type: "CpsParam";
};

export type GraphDrawerCpx = {
  cyNode: N;
  sanitizedDqmNode: ClassSanitizer<ICpx>;
  type: "Cpx";
};

export type GraphDrawerData =
  | GraphDrawerAst
  | GraphDrawerAstParam
  | GraphDrawerCps
  | GraphDrawerCpsParam
  | GraphDrawerCpx;

export type GraphDrawerDataTypes = GraphDrawerData["type"];

export type GraphDrawerModeOpen = {
  data: GraphDrawerData;
  type: "graph";
};

export type MenuDrawerModeOpen = GraphDrawerModeOpen | TemplateDrawerModeOpen;

export type UiStore = UiStoreActions & UiStoreStates;

export interface UiStoreActions {
  setAppState: (state: AppState) => void;
  setMenuOpen: (open: boolean) => void;
  setMenuWidth: (width: Percent) => void;
  setTemplateDrawerState: (mode: TemplateDrawerMode) => void;
}

export interface UiStoreStates {
  appState: AppState;
  isMenuOpen: boolean;
  isNarrow: boolean;
  menuWidth: Percent;
  templateDrawerState: TemplateDrawerMode;
}

type Percent = number;

type TemplateDrawerMode = MenuDrawerModeOpen | null;

// export type NumberTuple = [number, number];

type TemplateDrawerModeOpen = {
  index: number;
  type: TemplateDrawerModeType;
};

type TemplateDrawerModeType = "arrangement" | "single";
