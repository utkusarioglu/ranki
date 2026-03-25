import type { ITCpxNode } from "./export.types.mjs";
import type { IAstNode } from "./nodes/ast/export.types.mjs";
import type { ISerializedNode } from "./nodes/ser/i-serialized.types.mjs";

export type DqmParseInput = DqmParseInputString | DqmParseInputStructured;

export type DqmParseInputString = string & { type?: "DqmParseInputString" };

export type DqmParseInputStructured = CpxParseInput[];

export type DqmParseTheater = string & { type?: "DqmParseTheater" };

export type DqmParseRole = string & { type?: "DqmParseRole" };

export interface DqmAstOutputTheater {
  theater: DqmParseTheater;
  ast: IAstNode;
}
export type DqmAstOutput = DqmAstOutputTheater[];

export type DqmRecord = Record<DqmParseTheater, DqmParseInputString>;

export interface CpxParseInput {
  dqm: DqmParseInputString;
  theater: DqmParseTheater;
}

export interface DqmTransformOutputTheater {
  theater: DqmParseTheater;
  tCpx: ITCpxNode;
}

export type DqmTransformOutput = DqmTransformOutputTheater[];

export interface DqmSerializeOutputTheater {
  theater: DqmParseTheater;
  serialized: ISerializedNode[];
}

export type DqmSerializeOutput = DqmSerializeOutputTheater[];

export interface DqmParseOutput {
  ast: DqmAstOutput;
  trn: DqmTransformOutput;
  ser: DqmSerializeOutput;
}
