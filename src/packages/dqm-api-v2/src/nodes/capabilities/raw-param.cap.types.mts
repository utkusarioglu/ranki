import type {
  IAstParamNode,
  IAstParamSemanticCapability,
} from "../export.types.mjs";

export interface IAstParamCapability<T> extends IAstParamSemanticSection {
  getAstParam(): IAstParamNode | null;
  setAstParam(p: IAstParamNode): T;
  isCoupled(): boolean;
}

type IAstParamSemanticSection = Pick<
  IAstParamSemanticCapability,
  "getAudience" | "getChannel" | "getOperator"
>;
