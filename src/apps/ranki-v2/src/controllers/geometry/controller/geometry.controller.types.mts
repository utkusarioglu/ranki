export type GeometrySet = string & { type?: "GeometrySet" };

export interface OnEmitParams {
  set: GeometrySet;
}
