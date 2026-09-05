import type { CardMessage } from "./dqmConfigEntryFactory.types.mts";

export const ERROR_MESSAGE: CardMessage = {
  text: "This config is current ignored because it is not a valid yaml document.",
  type: "danger",
};

export const WHITESPACE_MESSAGE: CardMessage = {
  text: "This entry is currently being ignored because it only consists of whitespace.",
  type: "secondary",
};

export const EMPTY_MESSAGE: CardMessage = {
  text: "This entry is currently being ignored because it is empty.",
  type: "secondary",
};

export const INITIAL_MESSAGE: CardMessage = {
  text: "Awaiting configuration and key.",
  type: "secondary",
};
