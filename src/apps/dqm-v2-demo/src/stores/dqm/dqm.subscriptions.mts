import { useDqmStore } from "./dqm.store.mts";
import { debounce } from "./dqm.utils.mts";

const debounceEvent = debounce(() => {
  useDqmStore.getState().parseInput();
}, 300);

export const deferredParseDqmInput = () => {
  const { autoUpdate, deferParsing, parseInput } = useDqmStore.getState();
  if (autoUpdate) {
    if (deferParsing) {
      debounceEvent();
    } else {
      parseInput();
    }
  }
};
