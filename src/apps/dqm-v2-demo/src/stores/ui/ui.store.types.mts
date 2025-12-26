import type {
  IAstNode,
  ICps,
  ICpx,
  IAstParamNode,
} from "@dqm/package-dqm-api-v2";
import type { N } from "_displays/graph/build-elements/build.types";
import type { ClassSanitizer } from "../../utils/sanitizer.mts";

type Percent = number;

type TemplateDrawerModeType = "arrangement" | "single";

export type MenuDrawerModeOpen = TemplateDrawerModeOpen | GraphDrawerModeOpen;
type TemplateDrawerModeOpen = {
  type: TemplateDrawerModeType;
  index: number;
};

export type GraphDrawerModeOpen = {
  type: "graph";
  data: GraphDrawerData;
};

export type GraphDrawerDataTypes = GraphDrawerData["type"];

export type GraphDrawerData =
  | GraphDrawerAst
  | GraphDrawerCpx
  | GraphDrawerCps
  | GraphDrawerAstParam
  | GraphDrawerParam;

export type GraphDrawerAst = {
  type: "Ast";
  sanitizedDqmNode: ClassSanitizer<IAstNode>;
  cyNode: N;
};

export type GraphDrawerCpx = {
  type: "Cpx";
  sanitizedDqmNode: ClassSanitizer<ICpx>;
  cyNode: N;
};

export type GraphDrawerCps = {
  type: "Cps";
  sanitizedDqmNode: ClassSanitizer<ICps>;
  cyNode: N;
};

export type GraphDrawerAstParam = {
  type: "AstParam";
  sanitizedDqmNode: ClassSanitizer<IAstParamNode>;
  cyNode: N;
};

export type GraphDrawerParam = {
  type: "Param";
  sanitizedDqmNode: ClassSanitizer<IAstParamNode>;
  cyNode: N;
};

type TemplateDrawerMode = null | MenuDrawerModeOpen;

export type UiStore = UiStoreStates & UiStoreActions;

export type AppState = "init" | "loading" | "loaded" | "error" | "timeout";

export type NumberTuple = [number, number];

export interface UiStoreStates {
  appState: AppState;
  isNarrow: boolean;
  isMenuOpen: boolean;
  templateDrawerState: TemplateDrawerMode;
  menuWidth: Percent;

  previewSize: NumberTuple;
  previewScale: number;
}

export interface UiStoreActions {
  setMenuOpen: (open: boolean) => void;
  setMenuWidth: (width: Percent) => void;
  setTemplateDrawerState: (mode: TemplateDrawerMode) => void;
  setAppState: (state: AppState) => void;
  setPreviewSize: (n: NumberTuple) => void;
  setPreviewScale: (n: number) => void;
}
