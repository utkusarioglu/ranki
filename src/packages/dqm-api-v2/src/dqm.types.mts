import type { IAstNode } from "./export.types.mjs";

export type DqmParseInput = DqmParseInputString | DqmParseInputStructured;

export type DqmParseInputString = string & { type?: "DqmParseInputString" };

export type DqmParseInputStructured = CpxParseInput[];

export type DqmParseTheater = string & { type?: "DqmParseTheater" };

export type DqmParseRole = string & { type?: "DqmParseRole" };

// export type DqmParseOutput = Record<DqmParseTheater, IAstNode>;
export interface DqmParseOutputTheater {
  theater: DqmParseTheater;
  ast: IAstNode;
}
export type DqmParseOutput = DqmParseOutputTheater[];

export type DqmRecord = Record<DqmParseTheater, DqmParseInputString>;

export interface CpxParseInput {
  dqm: DqmParseInputString;
  // dqms: DqmRecord;
  theater: DqmParseTheater;
  // role: DqmParseRole;
}
