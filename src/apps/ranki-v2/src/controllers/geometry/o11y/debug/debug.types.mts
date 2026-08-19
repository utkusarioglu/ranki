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
