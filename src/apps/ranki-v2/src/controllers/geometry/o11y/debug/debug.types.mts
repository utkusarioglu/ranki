export interface DebugPause {
  duration: number;
  props: Record<string, unknown>;
}

export interface O11yDebuggerStaticConfig {
  enabled: boolean;
  sequencer?: {
    stutter?: number;
  };
}

export type O11yDebugLogAttributes = Record<string, unknown>;

export interface DebugLogDriver {
  log(value: O11yDebugLogAttributes): void;
}
