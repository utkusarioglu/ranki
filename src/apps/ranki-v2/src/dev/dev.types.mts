type RankiSetKeys = "deck" | "face" | "type" | "tags" | "a" | "b";

export type RankiSetValues = string | number | object;

export type RankiSetFunc = Record<RankiSetKeys, RankiSetValues>;

export type RankiPlayFields = Record<RankiSetKeys, RankiSetValues[]>;

export interface IRankiDevMethods {
  isPersisted: boolean;

  a(a: string): void;
  b(a: string): void;
  c(a: string): void;
  d(a: string): void;
  e(a: string): void;

  face(f: string): void;
  tags(f: string): void;
  type(f: string): void;
  card(f: string): void;
  flag(f: number): void;
  deck(d: string): void;
  templateConfig(d: object): void;
  cardConfig(d: object): void;

  trigger(): HTMLDivElement;
  persist(on: boolean): void;
  set(p: RankiSetFunc): void;
  play(p: RankiPlayFields): void;

  main(): Promise<void>;
}

declare global {
  interface Window {
    ranki?: IRankiDevMethods;
  }
}
