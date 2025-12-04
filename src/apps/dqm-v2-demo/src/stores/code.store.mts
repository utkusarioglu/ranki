import { create } from "zustand";
import { Dqm } from "@dqm/package-dqm-v2";
import baseV2 from "@dqm/plugin-base-v2";
import frameV2 from "@dqm/plugin-frame-v2";
import paramsV2 from "@dqm/plugin-params-v2";
import frameV2Code from "@dqm/plugin-frame-v2-code";
import { sanitize, type SanitizationFeature } from "./sanitize.mts";
import type { IAstNode } from "@dqm/package-dqm-api-v2";

interface Prop {
  id: SanitizationFeature;
  visible: boolean;
}

export interface CodeStore {
  dragProps: Prop[];
  lineageProps: Prop[];
  noDragProps: Prop[];
  raw: string;
  parsed: any;
  sanitized: any;
  setRaw: (raw: string) => void;
  setDragFeature: (feature: Prop[]) => void;
  setLineageFeature: (feature: Prop[]) => void;
  setNoDragFeature: (feature: Prop[]) => void;
}

interface ParseResultSuccess {
  state: "success";
  parsed: IAstNode;
  sanitized: any;
}

interface ParseResultFail {
  state: "fail";
  error: string;
}

type ParseResult = ParseResultSuccess | ParseResultFail;

type ParseRelevant = Pick<
  CodeStore,
  "dragProps" | "lineageProps" | "noDragProps"
>;

const filterIds = (...all: Prop[][]) =>
  all
    .map((a) => a.filter(({ visible }) => visible).map((v) => v.id))
    .reduce((a, c) => [...a, ...c], [] as SanitizationFeature[]);

function parseRaw(
  raw: any,
  { dragProps, noDragProps, lineageProps }: ParseRelevant,
): ParseResult {
  const dqm = new Dqm(
    {
      // @ts-ignore it expects the entire object
      console: {
        // @ts-ignore it expects the entire object
        plugins: {
          requested: ["ParamsV2", "FrameV2"],
        },
      },
    },
    [baseV2, frameV2, paramsV2, frameV2Code],
  );
  try {
    const parsed = dqm.parse(raw);
    // const sanitized = sanitize(parsed, [
    //   ...dragProps.filter(({ visible }) => visible).map((v) => v.id),
    //   ...lineageProps.filter(({ visible }) => visible).map((v) => v.id),
    //   ...noDragProps.filter(({ visible }) => visible).map((v) => v.id),
    // ]);
    const sanitized = sanitize(
      parsed,
      filterIds(dragProps, lineageProps, noDragProps),
    );
    return {
      state: "success",
      parsed,
      sanitized,
    };
  } catch (e) {
    console.log(e);
    return {
      state: "fail",
      error: (e as unknown as Error).toString(),
    };
  }
}

function createDefaults(raw: string, relevant: ParseRelevant) {
  const parsed = parseRaw(raw, relevant);
  switch (parsed.state) {
    case "success":
      return {
        // ...state,
        ...relevant,
        raw,
        ...parsed,
        // dragProps: props.dragProps.map((id) => ({visible: true, id})),
        // lineageProps: props.lineageProps.map((id) => ({visible: true, id})),
        // noDragProps: props.noDragProps.map((id) => ({visible: true, id})),
      };
    case "fail":
      return {
        // ...state,
        ...relevant,
        raw: "FAIL",
        parsed: {},
        sanitized: {},
        // dragProps: [],
        // noDragProps: [],
        // lineageProps: [],
      };
  }
}

const wrapVisible = (all: SanitizationFeature[]) =>
  all.map((id) => ({ visible: true, id }));

export const useCodeStore = create<CodeStore>((set) => ({
  ...createDefaults("hello world", {
    dragProps: wrapVisible(["idList", "creator"]),
    noDragProps: wrapVisible(["source"]),
    lineageProps: wrapVisible(["children", "subtree"]),
  }),

  setRaw: (raw: string) =>
    set((state) => ({
      raw,
      // TODO this doesn't account for the fail state
      ...parseRaw(raw, {
        dragProps: state.dragProps,
        lineageProps: state.lineageProps,
        noDragProps: state.noDragProps,
      }),
    })),

  setDragFeature: (dragProps: Prop[]) =>
    set(({ lineageProps, noDragProps, parsed }) => ({
      dragProps,
      sanitized: sanitize(
        parsed,
        filterIds(dragProps, lineageProps, noDragProps),
      ),
    })),

  setLineageFeature: (lineageProps: Prop[]) =>
    set(({ dragProps, noDragProps, parsed }) => ({
      lineageProps,
      sanitized: sanitize(
        parsed,
        filterIds(dragProps, lineageProps, noDragProps),
      ),
    })),

  setNoDragFeature: (noDragProps: Prop[]) =>
    set(({ dragProps, lineageProps, parsed }) => ({
      noDragProps,
      sanitized: sanitize(
        parsed,
        filterIds(dragProps, lineageProps, noDragProps),
      ),
    })),
}));
