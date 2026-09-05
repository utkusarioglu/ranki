import type { ConfigInput } from "_stores/dqm/dqm.store.types.mjs";
import type {
  CardMessage,
  DqmConfigEntryFactoryFuncProps,
} from "./dqmConfigEntryFactory.types.mts";

export interface LocalState {
  configStr: string;
  message: CardMessage;
}

export interface UseLocalStateParams {
  index: number;
  item: ConfigInput;
  setConfigValueByIndex: DqmConfigEntryFactoryFuncProps["setConfigValueByIndex"];
}
