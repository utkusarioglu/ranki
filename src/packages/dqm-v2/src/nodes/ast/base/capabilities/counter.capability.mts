import type {
  ContentDirection,
  CounterStat,
  InheritedCounters,
} from "@dqm/package-dqm-api-v2";

export function counterCapability<T>(self: T) {
  let blockDepth = 0;
  let inlineDepth = 0;
  let childIndex = 0;

  return {
    setChildIndex(i: CounterStat): T {
      childIndex = i;
      return self;
    },

    getChildIndex(): CounterStat {
      return childIndex;
    },

    setInheritedCounters(c: InheritedCounters): T {
      blockDepth = c.block;
      inlineDepth = c.inline;
      return self;
    },

    getInheritedCounters(): InheritedCounters {
      return {
        block: blockDepth,
        inline: inlineDepth,
      };
    },

    getBlockDepth(): number {
      return blockDepth;
    },

    getInlineDepth(): number {
      return inlineDepth;
    },

    getContentDepth(): CounterStat {
      return blockDepth + inlineDepth;
    },

    incrementDirection(type: ContentDirection, by: number = 1): T {
      switch (type) {
        case "block":
          blockDepth += by;
          break;
        case "inline":
          inlineDepth += by;
          break;
      }
      return self;
    },
  };
}
