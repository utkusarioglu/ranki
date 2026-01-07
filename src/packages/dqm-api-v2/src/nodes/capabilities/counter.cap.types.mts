export interface InheritedCounters {
  block: CounterStat;
  inline: CounterStat;
}

export type CounterStat = number & { type?: "CounterCount" };

export interface IAstNodeCounterCapabilities {
  setChildIndex(n: CounterStat): this;
  getChildIndex(): CounterStat;
  getInlineDepth(): CounterStat;
  getBlockDepth(): CounterStat;
}
