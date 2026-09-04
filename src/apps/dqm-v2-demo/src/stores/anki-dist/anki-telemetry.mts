import { create } from "zustand";

export type RankiOnEvent = (event: RankiIframeEvent) => void;

export interface RankiIframeEvent {
  log: string;
}

type AddEvent = (type: string, event: RankiIframeEvent) => void;

export type RankiTelemetryEventLog = RankiIframeEvent & {
  id: number;
  epoch: number;
  type: string;
};

interface Methods {
  addEvent: AddEvent;
}

interface State {
  events: RankiTelemetryEventLog[];
}

type AnkiTelemetry = Methods & State;

let id = 0;

export const useAnkiTelemetry = create<AnkiTelemetry>((set) => ({
  events: [],
  addEvent: (type, e) =>
    set((s) => ({
      events: [
        ...s.events,
        {
          type,
          id: id++,
          epoch: Date.now(),
          ...e,
        },
      ],
    })),
}));
