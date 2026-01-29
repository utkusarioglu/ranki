type RankiSetKeys = "deck" | "face" | "type" | "tags" | "a" | "b";

export type RankiSetValues = string | number | object;

export type RankiSetFunc = Record<RankiSetKeys, RankiSetValues>;

export type RankiPlayFields = Record<RankiSetKeys, RankiSetValues[]>;

interface RankiDebugMethods {
  trigger(): HTMLDivElement;
  face(f: string): void;
  a(a: string): void;
  b(a: string): void;
  tags(f: string): void;
  type(f: string): void;
  card(f: string): void;
  flag(f: number): void;
  deck(d: string): void;
  templateConfig(d: object): void;
  cardConfig(d: object): void;

  set(p: RankiSetFunc): void;
  play(p: RankiPlayFields): void;
}

declare global {
  interface Window {
    ranki: RankiDebugMethods;
  }
}
