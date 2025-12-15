import type { IAstNode } from "./nodes/ast/export.types.mjs";

export type DqmParseInput = DqmParseInputString | DqmParseInputStructured;

export type DqmParseInputString = string & { type?: "DqmParseInputString" };

export type DqmParseInputStructured = CpxParseInput[];

export type DqmParseTheater = string & { type?: "DqmParseTheater" };

export type DqmParseRole = string & { type?: "DqmParseRole" };

export interface DqmParseOutputTheater {
  theater: DqmParseTheater;
  ast: IAstNode;
}
export type DqmParseOutput = DqmParseOutputTheater[];

export type DqmRecord = Record<DqmParseTheater, DqmParseInputString>;

export interface CpxParseInput {
  dqm: DqmParseInputString;
  theater: DqmParseTheater;
}
