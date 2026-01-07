import type { ITrnNode } from "../trn/i-trn.types.mjs";

export interface ITrnCapability {
  assignTrn(t: ITrnNode[]): this;
  getTrn(): ITrnNode[];
}
