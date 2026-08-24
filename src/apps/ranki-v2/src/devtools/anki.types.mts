type AnkiSetKeys = "deck" | "face" | "type" | "tags" | "a" | "b";

export type AnkiSetValues = string | number | object;

export type AnkiSetFunc = Record<
  AnkiSetKeys,
  AnkiSetValues | [string, AnkiSetValues]
>;

export type AnkiPlayFields = Record<AnkiSetKeys, AnkiSetValues[]>;

export type AnkiRecordProps = Record<string, string>;

export interface IRankiDevAnkiMethods {
  // a(a: string): void;
  // b(a: string): void;
  // c(a: string): void;
  // d(a: string): void;
  // e(a: string): void;
  part(f: AnkiRecordProps): void;
  config(f: AnkiRecordProps): void;

  face(f: string): void;
  tags(f: string): void;
  type(f: string): void;
  card(f: string): void;
  flag(f: number): void;
  deck(d: string): void;

  // templateConfig(d: object): void;
  // cardConfig(d: object): void;

  trigger(): HTMLDivElement;

  set(p: AnkiSetFunc): void;
  play(p: AnkiPlayFields): void;
}
