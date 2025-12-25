import type { ParamDefaultValue } from "../../../export.types.mjs";
import type { AstSourceView } from "../capabilities/view.cap.types.mjs";

export interface IAstParamValueCapability {
  setValues(values: AstSourceView[]): this;
  getValues(): AstSourceView[];

  setDefaultValues(valueSpec: ParamDefaultValue[]): this;
  getDefaultValues(): ParamDefaultValue[];
}
