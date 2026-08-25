export type AnkiPlayFields = Record<AnkiSetKeys, AnkiSetValues[]>;

export type AnkiRecordProps = Record<string, string>;

export type AnkiSetFunc = Record<
  AnkiSetKeys,
  [string, AnkiSetValues] | AnkiSetValues
>;

export type AnkiSetValues = number | object | string;

export interface IRankiDevAnkiMethods {
  card(f: string): void;
  config(f: AnkiRecordProps): void;

  deck(d: string): void;
  face(f: string): void;
  flag(f: number): void;
  // a(a: string): void;
  // b(a: string): void;
  // c(a: string): void;
  // d(a: string): void;
  // e(a: string): void;
  part(f: AnkiRecordProps): void;
  play(p: AnkiPlayFields): void;
  set(p: AnkiSetFunc): void;

  // templateConfig(d: object): void;
  // cardConfig(d: object): void;

  tags(f: string): void;

  trigger(): HTMLDivElement;
  type(f: string): void;
}

type AnkiSetKeys = "a" | "b" | "deck" | "face" | "tags" | "type";
