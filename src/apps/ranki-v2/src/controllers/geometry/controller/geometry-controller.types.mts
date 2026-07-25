export type GeometrySetName = string & { type?: "GeometrySet" };

export interface OnEmitParams {
  set: GeometrySetName;
}
