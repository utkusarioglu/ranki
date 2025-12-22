import type { IAstNode, ICps, ICpx, IParam } from "@dqm/package-dqm-api-v2";
import type { N } from "_displays/graph/build-elements/build.types";

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
  | GraphDrawerRawParam
  | GraphDrawerParam;

export type GraphDrawerAst = {
  type: "ast";
  dqmNode: IAstNode;
  cyNode: N;
};

export type GraphDrawerCpx = {
  type: "cpx";
  dqmNode: ICpx;
  cyNode: N;
};

export type GraphDrawerCps = {
  type: "cps";
  dqmNode: ICps;
  cyNode: N;
};

export type GraphDrawerRawParam = {
  type: "rawParam";
  dqmNode: IParam;
  cyNode: N;
};

export type GraphDrawerParam = {
  type: "param";
  dqmNode: IParam;
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
