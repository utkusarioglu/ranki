export type DqmParseInput = string | CpxParseInput;

export interface CpxParseInput {
  inputs: Record<string, string>;
  theater: string;
  role: string;
}
