import type { FC } from "react";

import style from "./EventDisplay.module.css";
import type { RankiTelemetryEventLog } from "_stores/anki-dist/anki-telemetry.mjs";

interface EventsDisplayProps {
  events: RankiTelemetryEventLog[];
}

export const EventsDisplay: FC<EventsDisplayProps> = ({ events }) => {
  return (
    <div className={style.eventsDisplay}>
      {events.slice(-5, -1).map(({ id, epoch, type, log }) => (
        <div key={id} className={style.eventRow}>
          <span>{id}</span>
          <span>{new Date(epoch).toUTCString()}</span>
          <span>{type}</span>
          <span className={style.eventLog}>{log}</span>
        </div>
      ))}
    </div>
  );
};
