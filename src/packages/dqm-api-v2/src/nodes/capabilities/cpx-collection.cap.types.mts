import type { ICpx } from "../../export.types.mjs";

export interface CpxCollectionCapability {
  getCpx(): ICpx | null;
  setCpx(c: ICpx | null): this;
}
