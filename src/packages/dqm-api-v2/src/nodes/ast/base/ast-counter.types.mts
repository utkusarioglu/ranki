export interface InheritedCounters {
  block: CounterStat;
  inline: CounterStat;
}

export type CounterStat = number & { type?: "CounterCount" };
