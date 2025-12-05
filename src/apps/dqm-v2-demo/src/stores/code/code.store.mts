import { create } from "zustand";
import type {
  DqmParseInputString,
  DqmParseInputStructured,
  DqmParseTheater,
  DqmRecord,
} from "@dqm/package-dqm-api-v2";
import type { CodeStore, Prop } from "./types.mts";
import {
  createDefaults,
  filterIds,
  sanitizeAll,
  wrapVisible,
} from "./utils.mts";

const inputs: DqmParseInputStructured = {
  dqms: {
    default: "hello default bunny",
  },
  theater: "default",
  role: "default",
};

export const useCodeStore = create<CodeStore>((set) => ({
  ...createDefaults({
    inputs,
    dragProps: wrapVisible(["creator", "idList"]),
    noDragProps: wrapVisible(["source"]),
    lineageProps: wrapVisible(["children", "subtree"]),
  }),

  setAllDqms: (dqms: DqmRecord) =>
    set((state) => {
      const inputs = {
        ...state.inputs,
        dqms: dqms,
      };
      return createDefaults({
        inputs,
        dragProps: state.dragProps,
        lineageProps: state.lineageProps,
        noDragProps: state.noDragProps,
      });
    }),

  setTheaterDqms: (theater: DqmParseTheater, dqm: DqmParseInputString) =>
    set((state) => {
      const inputs = {
        ...state.inputs,
        dqms: {
          ...state.inputs.dqms,
          [theater]: dqm,
        },
      };

      return createDefaults({
        inputs,
        dragProps: state.dragProps,
        lineageProps: state.lineageProps,
        noDragProps: state.noDragProps,
      });
    }),

  setDragFeature: (dragProps: Prop[]) =>
    set(({ lineageProps, noDragProps, processed }) => {
      return {
        dragProps,
        processed: {
          ...processed,
          sanitized: sanitizeAll(
            processed.parsed,
            filterIds(dragProps, lineageProps, noDragProps),
          ),
        },
      };
    }),

  setLineageFeature: (lineageProps: Prop[]) =>
    set(({ dragProps, noDragProps, processed }) => ({
      lineageProps,
      processed: {
        ...processed,
        sanitized: sanitizeAll(
          processed.parsed,
          filterIds(dragProps, lineageProps, noDragProps),
        ),
      },
    })),

  setNoDragFeature: (noDragProps: Prop[]) =>
    set(({ dragProps, lineageProps, processed }) => ({
      noDragProps,
      processed: {
        ...processed,
        sanitized: sanitizeAll(
          processed.parsed,
          filterIds(dragProps, lineageProps, noDragProps),
        ),
      },
    })),
}));
