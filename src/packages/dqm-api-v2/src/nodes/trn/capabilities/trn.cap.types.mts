import type { ITrnNode } from "../i-trn.types.mjs";

export interface ITrnCapability {
  assignTrn(t: ITrnNode[]): this;
  getTrn(): ITrnNode[];
}
